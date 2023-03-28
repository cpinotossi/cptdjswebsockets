require('dotenv').config();
const pug = require('pug');

let args=process.argv;
const hostname = args.length>2 ? args[2] : process.env.HOSTNAME;
const httpPort = args.length>3 ? args[3] : process.env.HTTPPORT;
const wsPort = args.length>4 ? args[4] : process.env.WSPORT;

var WebSocket = require('ws');
console.log(`WebSocket Server started on port ${wsPort}`);
var rabbit = { x: 0, y: 0 };
wss = new WebSocket.Server({ port: wsPort });
wss.on('connection', function (ws) {
    ws.on('error', console.error);
    ws.on('message', function message(message) {
        console.log('received: %s', message);
        var incommingMsg = JSON.parse(message);
        rabbit.x = incommingMsg.x;
        rabbit.y = incommingMsg.y;
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(rabbit));
            }
        });
    });
    ws.send(JSON.stringify(rabbit));
});


const fs = require('fs').promises;
const http = require('http');
const HttpServer = http.createServer();

HttpServer.on('request', (req, res) => {
    console.log(`ra:${req.socket.remoteAddress},rp:${req.socket.remotePort},${req.url}`);
    switch (req.url) {
        case '/index.html':
            // Compile the source code
            const compiledFunction = pug.compileFile('client/index.html');
            // Render a set of data
            // console.log();
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(compiledFunction({
                hostname: hostname
            }));
            break;
        default:
            fs.readFile(__dirname + "/client" + req.url).then(contents => {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(contents);
            }).catch(err => {
                res.writeHead(500);
                res.end(err);
                return;
            });
            break;
    }
});

HttpServer.listen(httpPort, () => {
    console.log(`HTTP Server started on port ${httpPort}`);
});