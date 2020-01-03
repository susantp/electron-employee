const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  database: "crupee-salary-meter"
});
connection.connect(function(err) {
  if (err) {
    console.log(err.code);
    console.log(err.fatal);
  }
});
module.exports = connection;
