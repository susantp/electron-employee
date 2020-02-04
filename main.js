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
let reportW = null;

app.on("ready", () => {
  // Create the login window.
  const screen = electron.screen;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  loginW = new BrowserWindow({
    width: width * 0.7,
    height: height * 0.7,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  loginW
    .loadFile("./windows/login/index.html")
    .then(result => {
      // console.log(result);
    })
    .catch(err => {
      // console.log(err);
    });

  // Open the DevTools.
  // loginW.webContents.openDevTools();

  // Emitted when the window is closed.
  loginW.on("closed", () => {
    app.exit();
  });
  loginW.on("ready-to-show", () => {
    loginW.show();
  });
  // login window finished

  // Create the list window.
  listW = new BrowserWindow({
    width: width * 0.7,
    height: height * 0.7,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  listW
    .loadFile("./windows/list/list.html")
    .then(result => {
      // console.log(result);
    })
    .catch(err => {
      // console.log(err);
    });

  // Open the DevTools.
  // listW.webContents.openDevTools();

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
      // console.log(result);
    })
    .catch(err => {
      // console.log(err);
    });
  // addW.webContents.openDevTools();
  addW.on("close", event => {
    event.preventDefault();
    addW.hide();
  });
  // add window finished

  // edit window started
  editW = new BrowserWindow({
    width: width * 0.7,
    height: height * 0.7,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  editW
    .loadFile("./windows/edit/editEmployee.html")
    .then(result => {
      // console.log(result);
    })
    .catch(err => {
      // console.log(err);
    });
  // editW.webContents.openDevTools();
  editW.on("close", event => {
    event.preventDefault();
    editW.hide();
  });
  // edit widow finished

  // employee details window
  detailW = new BrowserWindow({
    width: width * 0.7,
    height: height * 0.7,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the employeeDetails.html of the app.
  detailW
    .loadFile("./windows/details/employeeDetails.html")
    .then(result => {
      // console.log(result);
    })
    .catch(err => {
      // console.log(err);
    });

  // Open the DevTools.
  // detailW.webContents.openDevTools();

  detailW.on("before-quit", event => {
    event.preventDefault();
    addW = null;
  });

  // Emitted when the window is closed.
  detailW.on("close", event => {
    detailW.hide();
    event.preventDefault();
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
      // console.log(result);
    })
    .catch(err => {
      // console.log(err);
    });

  // Open the DevTools.
  // generateSalaryW.webContents.openDevTools();

  // Emitted when the window is closed.
  generateSalaryW.on("close", event => {
    event.preventDefault();
    generateSalaryW.hide();
  });

  reportW = new BrowserWindow({
    width: width * 0.7,
    height: height * 0.7,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the generateSalary.html of the app.
  reportW
    .loadFile("./windows/report/report.html")
    .then(result => {
      // console.log(result);
    })
    .catch(err => {
      // console.log(err);
    });

  // Open the DevTools.
  // reportW.webContents.openDevTools();
  // generateSalaryW.webContents.openDevTools();

  // Emitted when the window is closed.
  reportW.on("close", event => {
    event.preventDefault();
    reportW.hide();
  });
  ipcMain.on("generateCall", () => {
    reportW.show();
  });
  // generate salary window finished

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});

// handle the login
ipcMain.on("form-submit", (event, status) => {
  if (status === true) {
    loginW.hide();
    listW.show();
  } else {
    const options = {
      type: "error",
      buttons: ["Retry", "Cancel"],
      title: "Invalid Login!!!",
      message: "You have put wrong username or password.",
      detail: "Do you want to try again or Exit ?"
    };
    dialog.showMessageBox(loginW, options).then(resolve => {
      if (resolve.response === 1) {
        app.exit();
      }
    });
  }
});

// getting employee from the db
ipcMain.on("employee-list", (event, rows, status) => {
  // console.log("the rows from the list.js", rows);
  event.sender.send("list-received", rows);
});

ipcMain.on("open-add-employee", (even, test) => {
  addW.show();
  // console.log("add employee form clicked ", test);
});
ipcMain.on("employee-added", (e, a) => {
  const options = {
    type: "info",
    buttons: ["Ok"],
    title: "Record Added.",
    message: "Successfully Added!!!",
    detail: "You have successfully added " + a.affectedRows + " record."
  };
  dialog.showMessageBox(addW, options).then(resolve => {
    if (resolve.response === 0) {
      addW.hide();
      listW.webContents.send("rowAdded");
    }
  });
});
// get the id from employee list of specific employee for their  details
ipcMain.on("employee-details-id", (event, id) => {
  detailW.show();
  detailW.webContents.send("employee-id", id);
});

// open generate salary window
ipcMain.on("open-generate-salary", (event, args) => {
  generateSalaryW.webContents.send("came-from-list");
  generateSalaryW.show();
});

// handle the image uplolad
ipcMain.on("open-file-dialog-for-file", function(event) {
  dialog
    .showOpenDialog(addW, {
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "gif"] }]
    })
    .then(result => {
      // console.log(result.canceled);
      event.sender.send("selected-file", result.filePaths[0]);
    })
    .catch(err => {
      // console.log(err);
    });
});

// get the id from employee list to be edited
ipcMain.on("employee-edit-id", (event, id) => {
  editW.show();
  editW.webContents.send("employee-id", id);
});

ipcMain.on("employee-edited", (event, results) => {
  const options = {
    type: "info",
    buttons: ["Ok"],
    title: "Edit Successfully",
    detail: results.affectedRows + " record updated"
  };
  dialog.showMessageBox(loginW, options).then(resolve => {
    if (resolve.response === 0) {
      editW.hide();
    }
  });
});

ipcMain.on("handleDelete", (event, args) => {
  const options = {
    type: "warning",
    buttons: ["Yes", "No"],
    title: "Delete Record",
    message: "You are going to delete record!!!",
    detail: "Are you Sure?"
  };
  dialog.showMessageBox(listW, options).then(resolve => {
    if (resolve.response === 0) {
      event.sender.send("deleteApproved");
    }
  });
});

ipcMain.on("openReportWindow", () => {
  reportW.show();
});

// ipcMain.on("report-data-collected", (event, args) => {
//   let providentFundAmt =
//     parseFloat(args.bInfo.basic_salary) *
//     (parseFloat(args.bInfo.provident_fund) / 100);
//   let totalAddition =
//     parseFloat(args.bInfo.basic_salary) +
//     parseFloat(args.bInfo.food_allowance) +
//     parseFloat(args.hInfo.ot_amount) +
//     parseFloat(args.bInfo.fuel_allowance);
//   let totalDeduction =
//     parseFloat(providentFundAmt) + parseFloat(args.bInfo.insurance);
//
//   const reportData = {
//     fName: args.bInfo.name,
//     designation: args.bInfo.designation,
//     month: args.month,
//     year: args.year,
//     basicScale: args.bInfo.basic_salary,
//     foodAllowance: args.bInfo.food_allowance,
//     oT: args.hInfo.ot_amount,
//     fuel: args.bInfo.fuel_allowance,
//     providentFund: providentFundAmt,
//     insurance: args.bInfo.insurance,
//     advance: args.hInfo.advance_amount,
//     totalAdd: totalAddition,
//     totalSub: totalDeduction
//   };
//   reportW.show();
//   reportW.webContents.send("reportDataSend", reportData);
// });
