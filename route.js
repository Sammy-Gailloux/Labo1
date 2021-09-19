const http = require('http');
const url = require('url');

function AccessControlConfig(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
}
function Prefligth(req, res) {
    if (req.method === 'OPTIONS') {
        console.log('preflight CORS verifications');
        res.end();
        // request handled
        return true;
    }
    // request not handled
    return false;
}

module.exports = http.createServer((req, res) => {
    AccessControlConfig(res);
    if (!Prefligth(req, res)) {
        const reqUrl = url.parse(req.url, true);
        var mathsFunc = require("./controller.js");

        if (reqUrl.pathname == "/api/maths" && req.method === 'GET') {
            console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
            mathsFunc.basicFuncs(req, res);
        }
        //Ajouter code si url non valide
    }
});