const { ipcRenderer } = require("electron");
const connection = require("./../../service/db-connection");
const os = require("os");

$(document).ready(function(event) {
  // selected user id
  var selectedUserId;

  // selected year
  var selectedYear;

  // basic salary
  var basicSalary;

  //working hours
  var workingHours;

  // insurance
  var insurance;

  // pf
  var providentFund;

  // food allowance
  var foodAllowance;

  // var fuel allowance
  var fuelAllowance;

  var test = 1;
  var bInfo = null;
  // get selected employee details
  ipcRenderer.on("employee-id", (event, id) => {
    // hide the table on document ready
    $("#salaryTable").hide();

    if (id) {
      selectedUserId = id;
    }

    let $query = `SELECT * FROM employee_profile WHERE id=?`;

    connection.query($query, [selectedUserId], (error, rows, field) => {
      if (error) console.log("error occur getting data ", error);
      bInfo = rows;
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit"
      };
      // ipcRenderer.send("selected-employee-details", rows);

      document.getElementById(
        "salaryDetails"
      ).innerHTML = `Salary Details of ${rows[0].name}`;
      document.getElementById("fullname").innerHTML = rows[0].name;
      document.getElementById("designation").innerHTML = rows[0].designation;
      // var date = rows[0].joined_date.toLocaleDateString("en-US", options);
      document.getElementById("joinedDate").innerHTML = rows[0].joined_date;
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
          os.homedir() + "/crupee-salary-info/images/" + rows[0].image;
      }
    });

    // on selection of year
    var selectedElement = document.getElementById("select");

    selectedElement.onchange = function selectChanged() {
      // reset table called

      reset_table();
      $("#salaryTable").hide();
      selectedYear =
        selectedElement.options[selectedElement.selectedIndex].value;
      // console.log("selected value is " + selectedYear);
      employeeDetails();
    };

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
              // console.log("list size is ", rows.length);
              for (var i = 0; i < rows.length; i++) {
                // console.log("inside month ", rows[i].month);
                // 1
                if (rows[i].month == "1") {
                  // console.log("first month is ", rows[i].month);
                  month = "January";
                  insertRow(rows[i], month);
                }

                // 2
                else if (rows[i].month == "2") {
                  month = "February";
                  insertRow(rows[i], month);
                }

                // 3
                else if (rows[i].month == "3") {
                  month = "March";
                  insertRow(rows[i], month);
                }

                // 4
                else if (rows[i].month == "4") {
                  month = "April";
                  insertRow(rows[i], month);
                }

                // 5
                else if (rows[i].month == "5") {
                  month = "May";
                  insertRow(rows[i], month);
                }

                // 6
                else if (rows[i].month == "6") {
                  month = "June";
                  insertRow(rows[i], month);
                }

                // 7
                else if (rows[i].month == "7") {
                  month = "July";
                  insertRow(rows[i], month);
                }

                // 8
                else if (rows[i].month == "8") {
                  month = "August";
                  insertRow(rows[i], month);
                }

                // 9
                else if (rows[i].month == "9") {
                  month = "September";
                  insertRow(rows[i], month);
                }

                // 10
                else if (rows[i].month == "10") {
                  month = "October";
                  insertRow(rows[i], month);
                }

                // 11
                else if (rows[i].month == "11") {
                  month = "November";
                  insertRow(rows[i], month);
                }

                // 12
                else if (rows[i].month == "12") {
                  month = "December";
                  insertRow(rows[i], month);
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
  });
  $("body").on("click", ".deleteHistoryRecord", function(e) {
    let historyIdToDelete = e.target.id;
    ipcRenderer.send("historyDelete", historyIdToDelete);
  });
  ipcRenderer.on("historyDeleteApproved", (e, a) => {
    let deleteApprovedId = a; // id of history
    const deleteQuery = "DELETE FROM employee_history WHERE  id=?";
    connection.query(deleteQuery, a, (error, rows, field) => {
      // console.log(
      //   "error: " + error,
      //   "rows: " + rows.affectedRows,
      //   "field: " + field
      // );
      if (error === null) {
      }
    });
  });
  // insert table body

  function insertRow(rows, month) {
    $("#salaryTable").show();

    var salaryTable = document.getElementById("salaryTable");

    // create row
    let row = salaryTable.insertRow();

    // create cell
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);
    let cell8 = row.insertCell(7);
    let cell9 = row.insertCell(8);
    let cell10 = row.insertCell(9);

    // add html to call
    cell1.innerHTML = month;
    cell2.innerHTML = basicSalary;
    cell3.innerHTML = rows.working_hours;
    cell4.innerHTML = insurance;
    cell5.innerHTML = providentFund;
    cell6.innerHTML = rows.ot_amount;
    cell7.innerHTML = foodAllowance;
    cell8.innerHTML = fuelAllowance;
    cell9.innerHTML = rows.total_amount;
    cell10.innerHTML =
      "<p class='btn btn-danger deleteHistoryRecord' id='" +
      rows.id +
      "'>Delete</p>";
  }

  // reset table
  function reset_table() {
    var salaryTable = document.getElementById("salaryTable");

    $("#salaryTable tr")
      .slice(1)
      .remove();
  }

  // end
});
