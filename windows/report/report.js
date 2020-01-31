const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const $ = require("jquery");
$(document).ready(function() {
  ipcRenderer.on("reportDataSend", (e, a) => {
    $("#fullName").html(a.fName);
    $("#designation").html(a.designation);
    $("#dateTime").html(a.month + ", " + a.year);
    $("#basicScale").html(a.basicScale);
    $("#providentFund").html(a.providentFund);
    $("#foodAllowance").html(a.foodAllowance);
    $("#overTime").html(a.oT);
    $("#fuelAllowance").html(a.fuel);
    $("#insuranceAmt").html(a.insurance);
    $("#totalAddition").html(a.totalAdd);
    $("#totalDeduction").html(a.totalSub);
    $("#netSalary").html(parseFloat(a.totalAdd) - parseFloat(a.totalSub));
  });
});
