const express = require('express');
const fs = require('fs')
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

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

pool.connect((error, client, done) => {
    console.log('success');
});