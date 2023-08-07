const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2452",
  database: "records",
});

connection.connect();

module.exports = connection;
