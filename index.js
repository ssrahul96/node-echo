const http = require('http');
const server = http.createServer();

server.on('request', (request, response) => {
    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        let logdata;
        logdata = `${request.method} ${request.url} \n`
        logdata = logdata + '> Headers\n'
        logdata = logdata + JSON.stringify(request.headers) + "\n"

        if (body) {
            logdata = logdata + '> Body\n'
            logdata = logdata + body
        }

        if (process.env.ADDITIONAL_CONTENT) {
            logdata = logdata + '> Additional Content\n'
            logdata = logdata + process.env.ADDITIONAL_CONTENT
        }
        console.log(logdata)

        response.writeHead(200)
        response.write(logdata)
        response.end();
    });
}).listen(80);