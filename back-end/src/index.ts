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
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = 8080;

app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: process.env.SESSION_SECRET as string,
}));

app.use(bodyParser.json());

app.get('/getRecipes', async (request, response) => {
    response.json(await getAllRecipes());
});

app.get('/logout', async(request, response) => {
    request.session.destroy((error) => {
      error && console.log('error', error);
      response.json({ loggedIn: false})
    })
});

app.post('/addRecipe', async (request, response) => {
})

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
    console.log(`Server active at http://localhost:${port}`)
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
        done();
        throw new Error('Connecting the database failed');
    }

    // ensure tables are created
    try {
        const hasBeenCreated = await createTables(client);
        if (hasBeenCreated) {
            const defaultRecipes: Recipe[] = JSON.parse(fs.readFileSync('testData.json', 'utf8'));

            for (let recipe of defaultRecipes) {
                await addRecipe(client, recipe);
            }
        }
    } catch (err) {
        console.log('error setting up tables', err);
    }

    // integrate later
    // await executeQuery(client, `INSERT INTO Users VALUES (100001, 'Ninja', 'topSecret')`);

    done();
});
