const express = require('express');
const fs = require('fs')
const cors = require('cors');

const app = express();
const port = 8080;

app.get('/getRecipes', async (error, response) => {
    const rawData = fs.readFileSync('testData.json', 'utf8');
    response.json(JSON.parse(rawData));
});

app.use(express.static('public'));
app.use(cors());

app.listen(port, () => {
    console.log(`Server active at http://localhost:${port}`)
});