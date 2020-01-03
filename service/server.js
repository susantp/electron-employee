const { remote, ipcRenderer } = require("electron");

const { handleForm } = remote.require("./main");
const currentWindow = remote.getCurrentWindow();

const submitButton = document.querySelector("#form");
const responseParagraph = document.getElementById("response");

submitButton.addEventListener("submit", function(event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  ipcRenderer.send("form-submit", username, password);
  // handleForm(currentWindow, username, password);
  username = "";
  password = "";
});

ipcRenderer.on("form-received", function(event, args) {
  responseParagraph.innerHTML = args;
});
