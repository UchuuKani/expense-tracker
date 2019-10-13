const pg = require('pg');
const client = new pg.Client('postgres://localhost/alex');

client.connect();

module.exports = client;
