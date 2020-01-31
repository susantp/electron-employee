const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const $ = require("jquery");
const connection = require("./../../service/db-connection");

$(document).ready(function() {
  ipcRenderer.on("openReportWindow", () => {
    let $query = `SELECT * FROM employee_profile`;

    connection.query($query, (error, rows, field) => {
      if (error) console.log("error occur getting data ", error);
      console.log(rows);
    });
  });
  // ipcRenderer.on("reportDataSend", (e, a) => {
  //   $("#fullName").html(a.fName);
  //   $("#designation").html(a.designation);
  //   $("#dateTime").html(a.month + ", " + a.year);
  //   $("#basicScale").html(a.basicScale);
  //   $("#providentFund").html(a.providentFund);
  //   $("#foodAllowance").html(a.foodAllowance);
  //   $("#overTime").html(a.oT);
  //   $("#fuelAllowance").html(a.fuel);
  //   $("#insuranceAmt").html(a.insurance);
  //   $("#totalAddition").html(a.totalAdd);
  //   $("#totalDeduction").html(a.totalSub);
  //   $("#netSalary").html(parseFloat(a.totalAdd) - parseFloat(a.totalSub));
  // });
});
