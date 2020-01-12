const electron = require("electron");
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const dialog = electron.dialog;

let loginW = null;
let listW = null;
let detailW = null;
let addW = null;
let editW = null;
let generateSalaryW = null;

app.on("ready", () => {
  // Create the login window.
  const screen = electron.screen;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  loginW = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  loginW
    .loadFile("./windows/login/index.html")
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });

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
    width: width,
    height: height,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  listW
    .loadFile("./windows/list/list.html")
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });

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
  addW
    .loadFile("./windows/add/addEmployee.html")
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
  addW.webContents.openDevTools();
  addW.on("close", event => {
    event.preventDefault();
    addW.hide();
  });
  // add window finished

  // edit window started
  editW = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  editW
    .loadFile("./windows/edit/editEmployee.html")
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
  editW.webContents.openDevTools();
  editW.on("close", event => {
    event.preventDefault();
    editW.hide();
  });
  // edit widow finished

  // employee details window
  detailW = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the employeeDetails.html of the app.
  detailW
    .loadFile("./windows/details/employeeDetails.html")
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });

  // Open the DevTools.
  detailW.webContents.openDevTools();

  // Emitted when the window is closed.
  detailW.on("close", event => {
    event.preventDefault();
    detailW.hide();
  });
  //details window finished

  // generate salary window

  generateSalaryW = new BrowserWindow({
    width: 1200,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the generateSalary.html of the app.
  generateSalaryW
    .loadFile("./windows/generate/generateSalary.html")
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });

  // Open the DevTools.
  generateSalaryW.webContents.openDevTools();

  // Emitted when the window is closed.
  generateSalaryW.on("close", event => {
    event.preventDefault();
    generateSalaryW.hide();
  });

  // generate salary window finished

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
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

// open generate salary window
ipcMain.on("open-generate-salary", (event, args) => {
  generateSalaryW.show();
});

ipcMain.on("open-file-dialog-for-file", function(event) {
  dialog
    .showOpenDialog(addW, {
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "gif"] }]
    })
    .then(result => {
      console.log(result.canceled);
      event.sender.send("selected-file", result.filePaths[0]);
    })
    .catch(err => {
      console.log(err);
    });
});
