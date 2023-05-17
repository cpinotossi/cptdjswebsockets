require('dotenv').config();
const pug = require('pug');

let args = process.argv;
const hostname = args.length > 2 ? args[2] : process.env.HOSTNAME;
const httpPort = args.length > 3 ? args[3] : process.env.HTTPPORT;
const bgcolor = args.length > 4 ? args[4] : process.env.BGCOLOR;
const env = args.length > 5 ? args[5] : process.env.ENV;

const fs = require('fs').promises;
const http = require('http');
const HttpServer = http.createServer();
const HealthHTTPResponseCode = 200;
const url = require('url');

HttpServer.on('request', (req, res) => {
    let rc = 0;
    console.log(`ra:${req.socket.remoteAddress},rp:${req.socket.remotePort},${req.url}`);
    console.log(`req.headers.cookie ${req.headers.cookie}`);
    switch (`req.url`) {
        case '/index.html':
            // const cookies = parseCookies(req);
            let cookies = parseCookies( req.headers.cookie );
            // Compile the source code
            const compiledFunction = pug.compileFile('client/index.html');
            // Render a set of data
            // console.log();
            // res.setHeader("Content-Type", "text/html");
            // res.setHeader('Set-Cookie', 'mycookie=test'),
            // res.writeHead(200);
            res.writeHead( 200, {
                'Set-Cookie': stringifyCookies(cookies),
                'Content-Type': 'text/html'
              } );
            res.end(compiledFunction({
                hostname: hostname,
                port: httpPort,
                bgcolor: bgcolor
            }));
            break;
        case '/green':
            res.setHeader("Content-Type", "text/html");
            if (env == 'green') {
                rc = 200;
            } else {
                rc = 500;;
            }
            res.writeHead(rc);
            res.end(JSON.stringify({
                responseCode: rc,
                hostname: hostname,
                port: httpPort,
                bgcolor: bgcolor
            }));
            break;
        case '/blue':
            res.setHeader("Content-Type", "text/html");
            if (env == 'blue') {
                rc = 200;
            } else {
                rc = 500;;
            }
            res.writeHead(rc);
            res.end(JSON.stringify({
                responseCode: rc,
                hostname: hostname,
                port: httpPort,
                bgcolor: bgcolor
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

var WebSocket = require('ws');
const { stringify } = require('querystring');
// console.log(`WebSocket Server started on port ${wsPort}`);
var sprite = { x: 0, y: 0 };
// wss = new WebSocket.Server({ port: wsPort });
wss = new WebSocket.Server({ server: HttpServer });
wss.on('connection', function (ws) {
    ws.on('error', console.error);
    ws.on('message', function message(message) {
        console.log('received: %s', message);
        var incommingMsg = JSON.parse(message);
        if (incommingMsg.isPosition) {
            sprite.x = incommingMsg.x;
            sprite.y = incommingMsg.y;
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    console.log('send: %s', message);
                    client.send(JSON.stringify(sprite));
                }
            });
        }
        else {
            console.log('send: %s', message);
        }
    });
    ws.send(JSON.stringify(sprite));
});

function parseCookies_ (request) {
    const list = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

function parseCookies(str) {
    let rx = /([^;=\s]*)=([^;]*)/g;
    let obj = { };
    for ( let m ; m = rx.exec(str) ; )
      obj[ m[1] ] = decodeURIComponent( m[2] );
    return obj;
  }
  
  function stringifyCookies(cookies) {
    return Object.entries( cookies )
      .map( ([k,v]) => k + '=' + encodeURIComponent(v) )
      .join( '; ');
  }

HttpServer.listen(httpPort, () => {
    console.log(`HTTP Server started on port ${httpPort} with hostname ${hostname}, env ${env}, bgcolor ${bgcolor}`);
});


