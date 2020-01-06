const { ipcRenderer, dialog } = require("electron");
var fs = require("fs");
var os = require("os");
const connection = require("./../../service/db-connection");

// when submit button clicked
var empDetailsBtn = document.getElementById("empDetailsBtn");
empDetailsBtn.addEventListener("click", event => {
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
  // var uploadFilePath = document.getElementById("uploadFile").value;

  var uploadFilePath = "sudip.jpg";

  $query =
    "INSERT INTO employee_profile (name,image,joined_date,food_allowance,fuel_allowance,insurance,basic_salary,provident_fund,contact_number,dob,designation,email,address) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
  connection.query(
    $query,
    [
      fullname,
      uploadFilePath,
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
      if (error) console.log(error.message);
      console.log(rows);
    }
  );
});
