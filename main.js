const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const ipcMain = electron.ipcMain;

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

function createListWindow() {
  // Create the browser window.
  listWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  listWindow.loadFile("list.html");

  // Open the DevTools.
  listWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  listWindow.on("closed", () => {
    listWindow = null;
  });
}

// create add employee form window
function createAddEmployeeWindow() {
  // Create the browser window.
  addEmployeeWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  addEmployeeWindow.loadFile("addEmployee.html");

  // Open the DevTools.
  addEmployeeWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  addEmployeeWindow.on("closed", () => {
    addEmployeeWindow = null;
  });
}

// employee details window
let addEmployeeDetailsWindow = null;
function createAddEmployeeDetailsWindow() {
  // Create the browser window.
  addEmployeeDetailsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the employeeDetails.html of the app.
  addEmployeeDetailsWindow.loadFile("employeeDetails.html");

  // Open the DevTools.
  addEmployeeDetailsWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  addEmployeeDetailsWindow.on("closed", () => {
    addEmployeeWindow = null;
  });
}

app.on("ready", createWindow);

ipcMain.on("form-submit", (event, status) => {
  event.sender.send("form-received", "received");
  if (status === "true") {
    win.hide();
    createListWindow();
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
  createAddEmployeeWindow();
  console.log("add employee form clicked ", test);
});

// employee details
ipcMain.on("employee-details-id", (event, id) => {
  console.log("the main page ", id);
  createAddEmployeeDetailsWindow();
  addEmployeeDetailsWindow.webContents.send("employee-id", id);
});

// event.sender.send("employee-id", id);
