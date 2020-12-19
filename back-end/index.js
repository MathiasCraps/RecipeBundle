const express = require('express');
const fs = require('fs')
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const { executeQuery } = require('./sql-utils/Database');

const app = express();
const port = 8080;

app.use(express.static('public'));
app.use(cors());

app.get('/getRecipes', async (error, response) => {
    const rawData = fs.readFileSync('testData.json', 'utf8');
    response.json(JSON.parse(rawData));
});

app.listen(port, () => {
    console.log(`Server active at http://localhost:${port}`)
});

dotenv.config();

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
