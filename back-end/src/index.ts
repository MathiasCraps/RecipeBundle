import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { graphqlHTTP } from 'express-graphql';
import session from "express-session";
import fs from "fs";
import { Pool } from "pg";
import sharp from 'sharp';
import { schema } from './graphql/Setup';
import { verifyLoggedIn } from "./middleware/VerifyLoggedIn";
import { Recipe, TestData } from "./model/RecipeData";
import { SessionData } from "./model/SessionData";
import { getSessionData } from "./routes/GetSessionData";
import { executeQuery } from './sql-utils/Database';
import { addRecipe } from "./sql/AddRecipe";
import { createCategories } from './sql/CreateCategories';
import { createTables } from "./sql/CreateTables";
import { editRecipe } from './sql/EditRecipe';
import { isRecipe } from "./validation/TypeGuards";
const multer = require('multer');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = 8080;
const upload = multer();

export const BASE_FILE_UPLOAD_DIRECTORY = `${__dirname}/public/uploads/`;

app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: String(process.env.SESSION_SECRET),
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single('userfile'));

app.get('/logout', async (request, response) => {
    request.session.destroy((error) => {
        error && console.log('error', error);
        response.json({ loggedIn: false })
    })
});

function getExtension(mimeType: string): string {
    switch (mimeType) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
    }
    return '';
}

app.post('/addRecipe', [verifyLoggedIn, async (request: Request, response: Response) => {
    const user = (request.session as SessionData).userName;
    if (!user) {
        response.json({ error: 'Not logged in' });
        return;
    }

    let recipe: Recipe;
    try {
        recipe = JSON.parse(request.body.recipe);
        if (!isRecipe(recipe)) {
            throw new Error('Invalid');
        }
    } catch (err) {
        response.json({ error: 'Invalid recipe data' });
        return;
    }

    const file = request.file;
    const trustedExtension = getExtension(file?.mimetype);
    if (!file || !file.buffer || !trustedExtension) {
        response.json({ error: 'Invalid image' });
        return;
    }

    let fileName: string;
    try {
        fileName = await writeImage(file.buffer, trustedExtension);
    } catch (err) {
        response.json({
            error: 'Could not write image'
        });
        return;
    }

    try {
        const publicImagePath = fileName ? `uploads/${fileName}` : ''
        recipe.image = publicImagePath;
        const recipeId = await addRecipe(pool, recipe);
        response.json({ success: true, recipeId, image: publicImagePath });
    } catch (err) {
        // todo for later: remove added image should writing to the database not work
        console.log('err', err);
        response.json({ error: 'Could not write to database' });
    }
}]);

app.post('/editRecipe', [verifyLoggedIn, async (request: Request, response: Response) => {
    const user = (request.session as SessionData).userName;
    if (!user) {
        response.json({ error: 'Not logged in' });
        return;
    }

    let recipe: Recipe;
    try {
        recipe = JSON.parse(request.body.recipe);
        if (!isRecipe(recipe)) {
            throw new Error('Invalid');
        }
    } catch (err) {
        console.log(err);
        response.json({ error: 'Invalid recipe data' });
        return;
    }

    // todo, second phase: handle image

    try {
        const originalImagePath = await editRecipe(pool, recipe);
        let location: string = '';
        if (request.file) {
            const extension = getExtension(request.file.mimetype);
            location = await writeImage(request.file.buffer, extension);
            fs.unlinkSync(BASE_FILE_UPLOAD_DIRECTORY.replace('uploads/', '') + originalImagePath);
            executeQuery(pool, {
                name: 'update-image',
                text: 'UPDATE Recipes SET image = $1 WHERE id = $2',
                values: [`uploads/${location}`, recipe.id]
            });
        }

        let imagePath = location || originalImagePath;

        response.json({ success: true, image: 'uploads/' + imagePath });
    } catch (err) {
        // todo for later: remove added image should writing to the database not work
        console.log('err', err);
        response.json({ error: 'Could not write to database' });
    }
}]);

app.get('/getSessionData', async (request, response) => {
    const session: SessionData = request.session as SessionData;
    const auth = request.query.code as string;

    try {
        const sessionData = await getSessionData(pool, session, auth);
        return response.json({
            loggedIn: true,
            userName: sessionData.userName
        });
    } catch (err) {
        return response.json({ loggedIn: false });
    }
});

async function writeImage(file: Buffer, extension: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const RANDOM_NAME = `${Number(new Date())}-${Math.random() * 10e18}`;
        const FILE_NAME = `${RANDOM_NAME}.${extension}`;

        const smallerImage = await sharp(file)
            .resize(750)
            .jpeg({ quality: 70 })
            .toBuffer();

        fs.writeFile(BASE_FILE_UPLOAD_DIRECTORY + FILE_NAME, smallerImage, async (err) => {
            if (!err) {
                resolve(`${FILE_NAME}`);
            } else {
                reject();
            }
        });
    });
}

app.listen(port, () => {
    console.log(`Server active at ${process.env.DOMAIN}`)
});

export const pool: Pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT)
});

pool.connect(async (error, client, done) => {
    if (error) {
        console.log(error);
        client.release();
        throw new Error('Connecting the database failed');
    }

    // ensure tables are created
    try {
        const hasBeenCreated = await createTables(pool);
        if (hasBeenCreated) {
            const testData: TestData = JSON.parse(fs.readFileSync('testData.json', 'utf8'));
            const recipes = testData.recipes;
            await createCategories(pool, testData.categories);

            for (let recipe of recipes) {
                await addRecipe(pool, recipe);
            }
        }
    } catch (err) {
        console.log('error setting up tables', err);
    }

    client.release();
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));