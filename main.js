const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const ipcMain = electron.ipcMain;

let loginW = null;
let listW = null;
let detailW = null;
let addW = null;

app.on("ready", () => {
  // Create the login window.
  loginW = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  loginW.loadFile("./windows/login/index.html");

  // Open the DevTools.
  loginW.webContents.openDevTools();

  // Emitted when the window is closed.
  loginW.on("closed", () => {
    loginW = null;
  });
  loginW.on("ready-to-show", () => {
    loginW.show();
  });
  // login window finished

  // Create the list window.
  listW = new BrowserWindow({
    width: 900,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  listW.loadFile("./windows/list/list.html");

  // Open the DevTools.
  listW.webContents.openDevTools();

  // Emitted when the window is closed.
  listW.on("closed", () => {
    listW = null;
  });
  //list window finished

  // create add employee form window
  addW = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  addW.loadFile("./windows/add/addEmployee.html");
  addW.webContents.openDevTools();
  addW.on("close", event => {
    event.preventDefault();
    addW.hide();
  });
  // add window finished

  // employee details window
  detailW = new BrowserWindow({
    width: 1200,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the employeeDetails.html of the app.
  detailW.loadFile("./windows/details/employeeDetails.html");

  // Open the DevTools.
  detailW.webContents.openDevTools();

  // Emitted when the window is closed.
  detailW.on("close", event => {
    event.preventDefault();
    detailW.hide();
  });
  //details window finished
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("form-submit", (event, status) => {
  if (status === true) {
    loginW.hide();
    listW.show();
  } else {
    event.sender.send("login-failed", "Login Failed");
  }
});

// getting employee from the db
ipcMain.on("employee-list", (event, rows, status) => {
  console.log("the rows from the list.js", rows);
  event.sender.send("list-received", rows);
});

// ipcMain.on("form-clicked", (event, args) => {
//   console.log("the form id ", args);
// });

ipcMain.on("open-add-employee", (even, test) => {
  addW.show();
  console.log("add employee form clicked ", test);
});

// employee details
ipcMain.on("employee-details-id", (event, id) => {
  console.log("the main page ", id);
  detailW.show();
  detailW.webContents.send("employee-id", id);
});

// event.sender.send("employee-id", id);
