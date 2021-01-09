import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import fs from "fs";
import { Pool } from "pg";
import { requestAccessToken } from "./github-api/GetAccessToken";
import { requestUserApi } from "./github-api/UserApiRequest";
import { UserMailScope } from "./model/github-api/UserMailScope";
import { UserScope } from "./model/github-api/UserScope";
import { Recipe } from "./model/RecipeData";
import { SessionData } from "./model/SessionData";
import { addRecipe } from "./sql/AddRecipe";
import { createTables } from "./sql/CreateTables";
import { getAllRecipes } from "./sql/GetRecipes";
import { isRecipe } from "./validation/TypeGuards";
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
    fs.writeFile(BASE_FILE_UPLOAD_DIRECTORY + FILE_NAME, file.buffer, (err) => {
        if (err) {
            response.json({
                error: 'Could not write image'
            });
            return;
        }

        pool.connect(async (error, client) => {
            const DB_ERROR = {error: 'Could not write to database'};
            // todo for later: remove added image should writing to the database not work
            if (error) {
                response.json(DB_ERROR);
                return;
            }

            try {
                recipe.image = `${process.env.DOMAIN}/uploads/${FILE_NAME}`; // todo: allow uploading image and use that instead
                await addRecipe(pool, recipe);
                response.json({success: true});
            } catch (err) {
                console.log('err', err);
                response.json(DB_ERROR);
            }
            client.release();
        });
    });  
});

app.get('/getSessionData', async (request, response) => {
    const session: SessionData = request.session as SessionData;
    if (session.userName) {
        response.json({
            loggedIn: true,
            userName: session.userName
        });
        return;
    }

    const auth = request.query.code;

    // no auth callback code found. Abort the request
    if (!auth) {
        response.json({
            loggedIn: false
        });
        return;
    }

    // in case we do not already have an accessToken, retrieve it
    if (!session.accessToken) {
        try {
            const accessToken = await requestAccessToken(auth as string);
            session.accessToken = accessToken as string;
        } catch (err) {
            console.log('error', err);
            response.json({
                loggedIn: false
            });
            return;            
        }
    }

    try {
        const baseUserInfo = await requestUserApi(session.accessToken, 'https://api.github.com/user') as UserScope;
        const eMailInfo = await requestUserApi(session.accessToken, 'https://api.github.com/user/emails') as UserMailScope[];
        const mail = eMailInfo.filter((mailInfo) => mailInfo.primary)[0]?.email;
    
        // nothing useful to use, abort
        if (!mail) {
          response.json({
            loggedIn: false
          });
          return;
        }
    
        const name = baseUserInfo.name || 'GitHub enabled ninja';
        session.userName = name;
        session.email = mail;
    
        response.json({
          loggedIn: true,
          userName: name
        });
    } catch (err) {
        response.json({
            loggedIn: false
        })
    }

    // todo: finish the logic
    // integrate database functionality
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

    // integrate later
    // await executeQuery(pool, `INSERT INTO Users VALUES (100001, 'Ninja', 'topSecret')`);

    client.release();
});
