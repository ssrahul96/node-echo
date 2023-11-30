const http = require('http');
const httpStatus = require('http-status-codes');
const server = http.createServer();


let listenPort = 80
if (process.env.SERVER_PORT) {
    listenPort = process.env.SERVER_PORT
}

const HTTP_REGEX = /(\/http\/)([1-5])\w+/

server.on('request', (request, response) => {
    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {

        let responseCode = 200;
        let logdata;
        if (request.url.match(HTTP_REGEX)) {
            // console.log("match : " + request.url)
            logdata = getHttpResponse(request);
        } else {
            logdata = getGenericResponse(body, request);
        }

        console.log(JSON.stringify(logdata));
        response.setHeader('Content-Type', 'application/json');
        response.writeHead(responseCode)
        response.write(JSON.stringify(logdata))
        response.end();
    });
}).listen(listenPort);

function getGenericResponse(body, request) {
    body = Buffer.concat(body).toString();

    logdata = {
        timestamp: Date.now(),
        method: request.method,
        url: request.url,
        headers: request.headers
    };

    if (body) {
        logdata['body'] = body;
    }

    if (process.env.ADDITIONAL_CONTENT) {
        logdata['additionalContents'] = process.env.ADDITIONAL_CONTENT;
    }

    return logdata;
}

function getHttpResponse(request) {
    let responseCode = request.url.split("/").pop();
    let message;

    try {
        message = httpStatus.getReasonPhrase(responseCode)
    } catch (err) { }

    logdata = {
        code: responseCode,
        message: message
    };

    return logdata;
}
