const { ipcRenderer, dialog } = require("electron");
const fs = require("fs");
const connection = require("./../../service/db-connection");
const os = require("os");

// when submit button clicked
let empDetailsBtn = document.getElementById("empDetailsBtn");
const submitForm = document.querySelector("#form");
let uploadedFilePath = null;
let fileElement = null;
submitForm.addEventListener("submit", event => {
  event.preventDefault();
  let fullname = document.getElementById("fullname").value;
  let joined_date = document.getElementById("joinedDate").value;
  let basic_salary = document.getElementById("basicSalary").value;
  let food_allowance = document.getElementById("foodAllowance").value;
  let fuel_allowance = document.getElementById("fuelAllowance").value;
  let insurance = document.getElementById("insurance").value;
  let pf = document.getElementById("pf").value;
  let contact = document.getElementById("contact").value;
  let dob = document.getElementById("dob").value;
  let designation = document.getElementById("designation").value;
  let email = document.getElementById("email").value;
  let address = document.getElementById("address").value;
  fileElement = document.getElementById("fileToUpload");
  let fileName = uploadedFilePath.replace(/^.*[\\\/]/, "");
  fs.copyFile(uploadedFilePath, __dirname + "/images/" + fileName, error => {
    if (error) {
      console.log(error);
    }
  });

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
      }
      console.log(rows);
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
