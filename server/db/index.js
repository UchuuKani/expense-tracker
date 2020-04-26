require("dotenv").config();
const pg = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const connectConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const client = new pg.Client(
  isProduction ? process.env.DATABASE_URL : connectConfig
);

client.connect();

module.exports = client;
