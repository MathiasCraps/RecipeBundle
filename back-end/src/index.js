const express = require('express');
const fs = require('fs')
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const { executeQuery } = require('./sql-utils/Database');
var session = require('express-session');
const process = require('process');
const { requestAccessToken } = require('./github-api/GetAccessToken');
const { requestUserApi } = require('./github-api/UserApiRequest');

dotenv.config();

const app = express();
const port = 8080;

app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
}));

app.get('/getRecipes', async (request, response) => {
    const rawData = fs.readFileSync('testData.json', 'utf8');
    response.json(JSON.parse(rawData));
});


app.get('/getSessionData', async (request, response) => {
    const session = request.session;
    if (session.userName) {
        return response.json({
            loggedIn: true,
            userName: session.userName
        });
    }

    const auth = request.query.code;
    if (!auth) {
        response.json({
            loggedIn: false
        });
    }

    if (!request.session.accessToken) {
        try {
            const accessToken = await requestAccessToken(auth);
            session.accessToken = accessToken;
        } catch (err) {
            console.log('error', err);
            response.json({
                loggedIn: false
            });
            return;
        }
    }

    const baseUserInfo = await requestUserApi(request.session.accessToken, 'https://api.github.com/user');
    const eMailInfo = await requestUserApi(request.session.accessToken, 'https://api.github.com/user/emails');
    const mail = eMailInfo.filter((mailInfo) => mailInfo.primary)[0]?.email;
    if (!mail) {
      return response.json({
        loggedIn: false
      });
    }

    const name = baseUserInfo.name || 'GitHub enabled ninja';
    session.userName = name;
    session.email = mail;

    response.json({
      loggedIn: true,
      name: name
    });

    // todo: finish the logic
    // 2) integrate database functionality
});


app.listen(port, () => {
    console.log(`Server active at http://localhost:${port}`)
});

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
});

pool.connect(async (error, client, done) => {
    if (error) {
        console.log(error);
        done();
        throw new Error('Connecting the database failed');
    }

    await executeQuery(client, `CREATE TABLE IF NOT EXISTS Users (
        id serial PRIMARY KEY,
        name varchar(500) NOT NULL,
        token varchar(500) NOT NULL
    )`);

    // integrate later
    // await executeQuery(client, `INSERT INTO Users VALUES (100001, 'Ninja', 'topSecret')`);

    client.release();
});
