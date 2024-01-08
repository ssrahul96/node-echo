const http = require('http');
const url = require('url');
const httpStatus = require('http-status-codes');
const server = http.createServer();

const sleep = (millis) => {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + millis) { }
};


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
            [logdata, responseCode] = getHttpResponse(request);
        } else {
            logdata = getGenericResponse(body, request);
        }

        let qp = url.parse(request.url, true)

        if (qp.query.delay) {
            let delay = parseInt(qp.query.delay);
            console.log(delay)
            // sleep(5 * 1000)
            sleep(delay * 1000);
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

    let logdata = {
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

    let logdata = {
        code: responseCode,
        message: message
    };

    return [logdata, responseCode];
}
