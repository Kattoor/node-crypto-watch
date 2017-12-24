const http = require('http');
const https = require('https');
const fs = require('fs');

/*const options = {
    key: fs.readFileSync('./key.key'),
    cert: fs.readFileSync('./cert.cert')
};*/

const server = http.createServer(/*options,*/ (req, res) => handle(req, res));
server.listen('80');

function handle(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    const url = req.url.slice(1);
    if (url === '')
        fs.readFile('./index.html', 'utf8', (error, data) => res.end(data));
    else
        getPrice(url, price => res.end(price));
}

const baseUrl = 'https://coinmarketcap.com/currencies/';

function getPrice(coin, callback) {
    https.get(baseUrl + coin + '/', res => {
        var buffer;
        res.on('data', chunk => buffer += chunk);
        res.on('end', () => {
            const match = /id="quote_price"[a-zA-Z-_ ="0-9.<>]*data-usd="([0-9.]*)"/.exec(buffer);
            callback(match && match.length >= 2 ? match[1] : '-1');
        });
    });
}
