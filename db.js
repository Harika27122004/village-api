const { Pool } = require("pg");

const pool = new Pool({
  user: "harika",
  host: "localhost",
  database: "village_db",
  password: "",
  port: 5432,
});

module.exports = pool;