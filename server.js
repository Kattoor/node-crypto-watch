const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => handle(req, res));
server.listen('8080');

function handle(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    const url = req.url.slice(1);
    getPrice(url, price => res.end(price));
}

const baseUrl = 'https://coinmarketcap.com/currencies/';

function getPrice(coin, callback) {
    https.get(baseUrl + coin + '/', res => {
        var buffer;
        res.on('data', chunk => buffer += chunk);
        res.on('end', () => callback(/id="quote_price"[a-zA-Z-_ ="0-9.<>]*data-usd="([0-9.]*)"/.exec(buffer)[1]));
    });
}
