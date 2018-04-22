// Seed lessons with Red Cross values with quantity of 0

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
  next();
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
