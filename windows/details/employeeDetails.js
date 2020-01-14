const { ipcRenderer } = require("electron");
const connection = require("./../../service/db-connection");
const app = require("electron").remote.app;

$(document).ready(function(event) {
  // selected user id
  var selectedUserId;

  // selected year
  var selectedYear;

  // basic salary
  var basicSalary;

  // insurance
  var insurance;

  // pf
  var providentFund;

  // food allowance
  var foodAllowance;

  // var fuel allowance
  var fuelAllowance;

  // get selected employee details
  ipcRenderer.on("employee-id", (event, id) => {
    // hide the table on document ready
    $("#salaryTable").hide();

    if (id) {
      selectedUserId = id;
    }

    console.log("id from employee details", selectedUserId);

    let $query = `SELECT * FROM employee_profile WHERE id=?`;

    connection.query($query, [selectedUserId], (error, rows, field) => {
      if (error) console.log("error occur getting data ", error);
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit"
      };
      ipcRenderer.send("selected-employee-details", rows);

      document.getElementById(
        "salaryDetails"
      ).innerHTML = `Salary Details of ${rows[0].name}`;
      document.getElementById("fullname").innerHTML = rows[0].name;
      document.getElementById("designation").innerHTML = rows[0].designation;
      var date = rows[0].joined_date.toLocaleDateString("en-US", options);
      document.getElementById("joinedDate").innerHTML = date;
      document.getElementById("email").innerHTML = rows[0].email;
      document.getElementById("address").innerHTML = rows[0].address;
      document.getElementById("contactNumber").innerHTML =
        rows[0].contact_number;
      document.getElementById("dob").innerHTML = rows[0].dob;

      // set the value to global variable
      basicSalary = rows[0].basic_salary;
      insurance = rows[0].insurance;
      providentFund = rows[0].provident_fund;
      foodAllowance = rows[0].food_allowance;
      fuelAllowance = rows[0].fuel_allowance;

      if (
        rows[0].image === "undefined" ||
        rows[0].image === "" ||
        rows[0].image === null
      ) {
        document.getElementById("profImg").src = __dirname + "/placeholder.png";
      } else {
        document.getElementById("profImg").src =
          app.getAppPath() + "/windows/add/images/" + rows[0].image;
      }
    });

    // on selection of year
    var selectedElement = document.getElementById("select");

    selectedElement.addEventListener("change", function(event) {
      event.preventDefault();
      // reset table called
      reset_table();
      selectedYear =
        selectedElement.options[selectedElement.selectedIndex].value;
      console.log("selected value is " + selectedYear);
      employeeDetails();
    });

    // employee details function
    function employeeDetails() {
      $quer1 = "SELECT * FROM employee_history WHERE e_id=? AND year=?";
      if (selectedYear != "selected value is " && selectedUserId != null) {
        connection.query(
          $quer1,
          [selectedUserId, selectedYear],
          (error, rows, field) => {
            if (error) console.log("error getting history from db ", error);
            if (rows.length >= 1) {
              // loop through the result
              for (var i = 0; i < rows.length; i++) {
                console.log("inside month ", rows[i].month);
                // 1
                if (rows[i].month == "1") {
                  console.log("first month is ", rows[i].month);
                  month = "January";
                  insertRow(rows[i], month);
                }

                // 2
                else if (rows[i].month == "2") {
                  month = "February";
                  insertRow(rows[i], month);
                  console.log("second month is ", rows[i].month);
                }

                // 3
                else if (rows[i].month == "3") {
                  console.log("second month is ", rows[i].month);
                }

                // 4
                else if (rows[i].month == "4") {
                  console.log("second month is ", rows[i].month);
                }

                // 5
                else if (rows[i].month == "5") {
                  console.log("second month is ", rows[i].month);
                }

                // 6
                else if (rows[i].month == "6") {
                  console.log("second month is ", rows[i].month);
                }

                // 7
                else if (rows[i].month == "7") {
                  console.log("second month is ", rows[i].month);
                }

                // 8
                else if (rows[i].month == "8") {
                  console.log("second month is ", rows[i].month);
                }

                // 9
                else if (rows[i].month == "9") {
                  console.log("second month is ", rows[i].month);
                }

                // 10
                else if (rows[i].month == "10") {
                  console.log("second month is ", rows[i].month);
                }

                // 11
                else if (rows[i].month == "11") {
                  console.log("second month is ", rows[i].month);
                }

                // 12
                else if (rows[i].month == "12") {
                  console.log("second month is ", rows[i].month);
                }

                // else
                else {
                  console.log("month is not between 1 to 12");
                }
                // end of loop
              }
            }
          }
        );
      }
    }
    // end of function

    test1 = () => {
      console.log(
        "selected id is " + selectedUserId + "selected year is " + selectedYear
      );
    };
  });

  // insert table body

  function insertRow(rows, month) {
    console.log("function called");

    $("#salaryTable").show();
    var salaryTable = document.getElementById("salaryTable");
    // create row
    let row = salaryTable.insertRow(1);

    // create cell
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);
    let cell8 = row.insertCell(7);

    // add html to call
    cell1.innerHTML = month;
    cell2.innerHTML = basicSalary;
    cell3.innerHTML = insurance;
    cell4.innerHTML = providentFund;
    cell5.innerHTML = rows.ot_amount;
    cell6.innerHTML = foodAllowance;
    cell7.innerHTML = fuelAllowance;
    cell8.innerHTML = rows.total_amount;
  }

  // reset table
  function reset_table() {
    console.log("reset table called");
    // $("#salaryTable tr").remove(1);
    $("#salaryTable")
      .find('input[type="text"], select')
      .val("");
  }

  // end
});
