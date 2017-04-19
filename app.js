require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
// const fedexAPI = require('usend-fedex');
const fedexAPI = require('shipping-fedex');

const app = express();

const routes = require('./app/routes/shipments.js');

const UPS_API_KEY = process.env.UPS_API_KEY;
const FEDEX_API_KEY = process.env.FEDEX_API_KEY;

const PORT = process.env.PORT || 8080;
const SERVER_URL = process.env.SERVER_URL || 'http://localhost';

app.use(bodyParser.json());

let fedex = new fedexAPI({
    environment: 'sandbox', // or live
    debug: true,
    key: process.env.FEDEX_API_KEY,
    password: process.env.FEDEX_PASSWORD,
    account_number: process.env.FEDEX_ACCOUNT_NUMBER,
    meter_number: process.env.FEDEX_METER_NUMBER,
    imperial: true // set to false for metric
  });


// routes.set(app);
const fedexRoutes = require('./app/routes/shipments.js')(fedex);
app.set("view engine", "ejs");

app.use('/', fedexRoutes)

winston.level = 'debug';
app.listen(PORT, () => {
  winston.info(`App listening on ${SERVER_URL}:${PORT}`);
});

module.exports = app;
