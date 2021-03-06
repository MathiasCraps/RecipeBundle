import https from "https";

export function requestAccessToken (clientCode: string) {
    return new Promise((resolve, reject) => {
        var postData = [
            `client_id=${process.env.GITHUB_CLIENT_ID}`,
            `client_secret=${process.env.GITHUB_AUTH_SECRET}`,
            `code=${clientCode}`
        ].join('&');
    
        const url = 'https://github.com/login/oauth/access_token'
    
        var options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        }
    
        var httpRequest = https.request(url, options, (resp) => {
            resp.on('data', (rawData) => {
                var data = JSON.parse(rawData);
                if (data.error) {
                    reject({ error: true });
                    return;
                }
    
                if (data.access_token) {
                    resolve(data.access_token);
                }
            });
        });
    
        httpRequest.on('error', function (errorEvent) {
            reject(errorEvent);
        });
    
        httpRequest.write(postData);
        httpRequest.end();
    });

}