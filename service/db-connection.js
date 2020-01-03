const { remote, ipcRenderer } = require("electron");
var mysql = require("mysql");

var connection = mysql.createConnection({
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

const submitButton = document.querySelector("#form");

submitButton.addEventListener("submit", function(event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  $query = "SELECT * FROM users WHERE username=? AND password=?";

  connection.query($query, [username, password], (err, rows, field) => {
    if (rows.length == 1) {
      status = true;
    } else {
      status = false;
    }

    ipcRenderer.send("form-submit", status);
  });

  username = "";
  password = "";
});

ipcRenderer.on("form-received", function(event, args) {});

module.exports.connection = connection;
