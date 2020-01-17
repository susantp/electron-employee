const { ipcRenderer, dialog } = require("electron");
const connection = require("./../../service/db-connection");
const app = require("electron").remote.app;
const fs = require("fs");

// when document is ready
$(document).ready(function() {
  var employee_id;
  var uploadedFilePath = null;
  var fileElement = null;
  // getting id from main on edit button click
  ipcRenderer.on("employee-id", (event, id) => {
    employee_id = id;
    console.log("id to be edited is ", employee_id);

    $query = " SELECT * FROM employee_profile WHERE id=?";
    connection.query($query, [employee_id], (error, rows, field) => {
      if (error) console.log("error connection db");
      document.getElementById("fullname").value = rows[0].name;
      document.getElementById("joinedDate").value = rows[0].joined_date;
      document.getElementById("basicSalary").value = rows[0].basic_salary;
      document.getElementById("foodAllowance").value = rows[0].food_allowance;
      document.getElementById("fuelAllowance").value = rows[0].fuel_allowance;
      document.getElementById("insurance").value = rows[0].insurance;
      document.getElementById("pf").value = rows[0].provident_fund;
      document.getElementById("contact").value = rows[0].contact_number;
      document.getElementById("dob").value = rows[0].dob;
      document.getElementById("designation").value = rows[0].designation;
      document.getElementById("email").value = rows[0].email;
      document.getElementById("address").value = rows[0].address;
      test1();
    });
  });

  // edit button is clicked

  // test function
  test1 = () => {
    console.log("employee id outside the function is ", employee_id);
  };

  const submitForm = document.querySelector("#form");

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
      var fileName = uploadedFilePath.replace(/^.*[\\\/]/, "");
    }

    // copy file
    fs.copyFile(
      uploadedFilePath,
      app.getAppPath() + "/windows/add/images/" + fileName,
      error => {
        if (error) {
          console.log(error);
        }
      }
    );

    // query
    $query =
      "UPDATE employee_profile SET name=?,image=?,joined_date=?,food_allowance=?,fuel_allowance=?,insurance=?,basic_salary=?,provident_fund=?,contact_number=?,dob=?,designation=?,email=?,address=?  WHERE id=?";
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
        address,
        employee_id
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
      console.log(filePath);

      uploadedFilePath = filePath;
    });
  });
  // end
});

//
