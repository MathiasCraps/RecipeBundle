const express = require('express');
const fs = require('fs')

const app = express();
const port = 8080;

app.get('/getRecipes', async (error, response) => {
    const rawData = fs.readFileSync('testData.json', 'utf8');
    response.json(JSON.parse(rawData));
});

app.listen(port, () => {
    console.log(`Server active at http://localhost:${port}`)
});