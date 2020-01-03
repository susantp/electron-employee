const { ipcRenderer } = require("electron");

ipcRenderer.on("employee-id", (event, id) => {
  console.log("id from employee details", id);
});
