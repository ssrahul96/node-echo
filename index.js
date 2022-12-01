const http = require('http');
const server = http.createServer();

server.on('request', (request, response) => {
    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        let logdata = {
            timestamp: Date.now(),
            method: request.method,
            url: request.url,
            headers: request.headers
        }

        if (body) {
            logdata['body'] = body;
        }

        if (process.env.ADDITIONAL_CONTENT) {
            logdata['additionalContents'] = process.env.ADDITIONAL_CONTENT
        }

        console.log(JSON.stringify(logdata))

        response.setHeader('Content-Type', 'application/json');
        response.writeHead(200)
        response.write(JSON.stringify(logdata))
        response.end();
    });
}).listen(80);