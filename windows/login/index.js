const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const connection = require("./../../service/db-connection");

const submitButton = document.querySelector("#form");
let status = true;
submitButton.addEventListener("submit", function(event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  const $query = "SELECT * FROM users WHERE username=? AND password=?";

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
