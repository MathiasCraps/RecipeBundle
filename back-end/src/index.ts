import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import fs from "fs";
import { Pool } from "pg";
import { verifyLoggedIn } from "./middleware/VerifyLoggedIn";
import { Recipe } from "./model/RecipeData";
import { SessionData } from "./model/SessionData";
import { getSessionData } from "./routes/GetSessionData";
import { addRecipe } from "./sql/AddRecipe";
import { createTables } from "./sql/CreateTables";
import { getAllRecipes } from "./sql/GetRecipes";
import { updateDateMenu } from "./sql/UpdateDateMenu";
import { modifyMenu } from "./sql/UpdateMenu";
import { isDayMenu, isRecipe } from "./validation/TypeGuards";
const multer = require('multer');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = 8080;
const upload = multer();

const BASE_FILE_UPLOAD_DIRECTORY = `${__dirname}/public/uploads/`;

app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: process.env.SESSION_SECRET as string,
}));

app.post('*', verifyLoggedIn);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single('userfile'));

app.get('/getRecipes', async (request, response) => {
    response.json(await getAllRecipes());
});

app.get('/logout', async(request, response) => {
    request.session.destroy((error) => {
      error && console.log('error', error);
      response.json({ loggedIn: false})
    })
});

function getExtension(mimeType: string): string {
    switch(mimeType) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
    }
    return '';
}

app.post('/addRecipe', async (request, response) => {
    const user = (request.session as SessionData).userName;
    if (!user) {
        response.json({error: 'Not logged in'});
        return;
    }

    let recipe: Recipe;
    try {
        recipe = JSON.parse(request.body.recipe);
        if (!isRecipe(recipe)) {
            throw new Error('Invalid');
        }    
    } catch (err) {
        response.json({error: 'Invalid recipe data'});
        return;
    }

    const file = request.file;
    const trustedExtension = getExtension(file?.mimetype);
    if (!file || !file.buffer || !trustedExtension) {
        response.json({error: 'Invalid image'});
        return;
    }

    const RANDOM_NAME = `${Number(new Date())}-${Math.random() * 10e18}`;
    const FILE_NAME = `${RANDOM_NAME}.${trustedExtension}`;
    fs.writeFile(BASE_FILE_UPLOAD_DIRECTORY + FILE_NAME, file.buffer, async(err) => {
        if (err) {
            response.json({
                error: 'Could not write image'
            });
            return;
        }

        try {
            recipe.image = `${process.env.DOMAIN}/uploads/${FILE_NAME}`;
            const recipeId = await addRecipe(pool, recipe);
            response.json({success: true, recipeId });    
        } catch (err) {
            // todo for later: remove added image should writing to the database not work
            console.log('err', err);
            response.json({error: 'Could not write to database'});
        }
    });  
});

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

app.post('/addMenu', async(request, response) => {
    const session: SessionData = request.session as SessionData;
    
    if (!isDayMenu(request.body)) {
        return response.json({error: 'Invalid data'});
    }
    
    try {
        const menuId = await modifyMenu(pool, request.body, session.userId!, 'add');
        return response.json({
            success: true,
            menuId
        });
    } catch (err) {
        console.log(err);
        return response.json({error: 'Writing to database failed'});
    }
});

app.post('/removeMenu', async(request, response) => { 
    const session = (request.session) as SessionData;  
    if (typeof request.body.menuId !== 'number') {
        return response.json({error: 'Invalid data'});
    }
    
    try {
        await modifyMenu(pool, request.body, session.userId!, 'remove');
        return response.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        return response.json({error: 'Writing to database failed'});
    }
});

app.post('/updateMenu', async(request, response) => {
    const session: SessionData = request.session as SessionData;
    const { menuId, date } = request.body;
    
    if (typeof menuId !== 'number' || typeof date !== 'number') {
        return response.json({error: 'Invalid data'});
    }

    try {
        await updateDateMenu(pool, menuId, date, session.userId!)
        return response.json({success: true});
    } catch (err) {
        return response.json({error: true});
    }
});


app.listen(port, () => {
    console.log(`Server active at ${process.env.DOMAIN}`)
});

export const pool: Pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT as unknown as number
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
            const defaultRecipes: Recipe[] = JSON.parse(fs.readFileSync('testData.json', 'utf8'));

            for (let recipe of defaultRecipes) {
                await addRecipe(pool, recipe);
            }
        }
    } catch (err) {
        console.log('error setting up tables', err);
    }

    client.release();
});
