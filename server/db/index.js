const pg = require('pg');
const client = new pg.Client('postgres://localhost/bill-tracker');

client.connect();

module.exports = client;
