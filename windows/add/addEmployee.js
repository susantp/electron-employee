const { ipcRenderer, dialog } = require("electron");
const app = require("electron").remote.app;
const fs = require("fs");
const connection = require("./../../service/db-connection");
const os = require("os");

// when submit button clicked
var empDetailsBtn = document.getElementById("empDetailsBtn");
const submitForm = document.querySelector("#form");
var uploadedFilePath = null;
var fileElement = null;
var fileElement = null;
submitForm.addEventListener("submit", event => {
  event.preventDefault();
  var fullname = document.getElementById("fullname").value;
  var joined_date = document.getElementById("joinedDate").value;
  var basic_salary = document.getElementById("basicSalary").value;
  var food_allowance = document.getElementById("foodAllowance").value;
  var fuel_allowance = document.getElementById("fuelAllowance").value;
  var insurance = document.getElementById("insurance").value;
  var pf = document.getElementById("pf").value;
  var contact = document.getElementById("contact").value;
  var dob = document.getElementById("dob").value;
  var designation = document.getElementById("designation").value;
  var email = document.getElementById("email").value;
  var address = document.getElementById("address").value;
  fileElement = document.getElementById("fileToUpload");
  if (uploadedFilePath) {
    fileName = uploadedFilePath.replace(/^.*[\\\/]/, "");
  }

  fs.copyFile(
    uploadedFilePath,
    app.getAppPath() + "/windows/add/images/" + fileName,
    error => {
      if (error) {
        console.log(error);
      }
    }
  );

  $query =
    "INSERT INTO employee_profile (name,image,joined_date,food_allowance,fuel_allowance,insurance,basic_salary,provident_fund,contact_number,dob,designation,email,address) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
  connection.query(
    $query,
    [
      fullname,
      fileName,
      joined_date,
      food_allowance,
      fuel_allowance,
      insurance,
      basic_salary,
      pf,
      contact,
      dob,
      designation,
      email,
      address
    ],
    (error, rows, field) => {
      if (error) {
        console.log(error.message);
      } else {
        ipcRenderer.send("employee-added", rows);
      }
    }
  );
});
document.getElementById("fileToUpload").addEventListener("click", event => {
  event.preventDefault();
  ipcRenderer.send("open-file-dialog-for-file");
  ipcRenderer.on("selected-file", (e, filePath) => {
    // console.log(filePath);
    uploadedFilePath = filePath;
  });
});
