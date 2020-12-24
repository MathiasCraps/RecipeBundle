const https = require('https');

module.exports.requestUserApi = function (token) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.github.com/user'
    
        var options = {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'user-agent': 'curl/7.22.0'
            }
        }
    
        var httpRequest = https.request(url, options, (resp) => {
            let body = '';
            resp.setEncoding('utf8');
            resp.on('data', (rawData) => {
                body += rawData
            });

            resp.on('end', () => {
                resolve(JSON.parse(body));
            })
        });
    
        httpRequest.on('error', function (errorEvent) {
            reject({ error: true });
        });
    
        httpRequest.end();
    });
}