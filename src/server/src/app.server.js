const http = require('http');
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).send({
            message: "Successful OPTIONS request"
        });
    } else {
        next();
    }
});

// Require our routes into the application.
require('./routes')(app);
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the eggbeatr API!',
    app: "http://localhost:8080",
    GitHub: "https://github.com/istreight/eggbeatr"
}));

const port = parseInt(process.env.PORT, 10) || 8081;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
