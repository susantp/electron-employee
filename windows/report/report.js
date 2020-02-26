const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const $ = require("jquery");
const connection = require("./../../service/db-connection");

$(document).ready(function() {
  let yearSelect = document.getElementById("year");
  let monthSelect = document.getElementById("month");
  let employeeSelect = document.getElementById("employee");
  let gBtn = document.getElementById("gBtn");
  let pBtn = document.getElementById("pBtn");
  let rDateTime = document.getElementById("rDateTime");

  // to populate employee select list
  let $query = `SELECT id, name FROM employee_profile`;
  connection.query($query, (error, rows, field) => {
    if (error) console.log("error occur getting data ", error);
    for (let row in rows) {
      let opt = document.createElement("option");
      opt.value = rows[row].id;
      opt.innerHTML = rows[row].name;
      employeeSelect.appendChild(opt);
    }
  });

  // to populate employee select list
  let hQuery = `SELECT DISTINCT year FROM employee_history`;
  connection.query(hQuery, (error, rows, field) => {
    if (error) console.log("error occur getting data ", error);
    for (let row in rows) {
      let opt = document.createElement("option");
      opt.value = rows[row].year;
      opt.innerHTML = rows[row].year;
      yearSelect.appendChild(opt);
    }
  });

  pBtn.addEventListener("click", e => {
    e.preventDefault();
    pBtn.style.visibility = "hidden";
    window.print();
  });
  gBtn.addEventListener("click", (e, a) => {
    e.preventDefault();
    let today = new Date();
    pBtn.style.visibility = "visible";
    rDateTime.innerHTML =
      today.getFullYear() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getDate() +
      " " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
    let yearSelectedValue = yearSelect.options[yearSelect.selectedIndex].value;
    let monthSelectedValue =
      monthSelect.options[monthSelect.selectedIndex].value;
    let monthSelectedText = monthSelect.options[monthSelect.selectedIndex].text;
    let employeeSelectedValue =
      employeeSelect.options[employeeSelect.selectedIndex].value;

    let employeeProfileQuery = "SELECT * FROM employee_profile WHERE id=?";
    connection.query(
      employeeProfileQuery,
      [employeeSelectedValue],
      (error, profileRows) => {
        if (error)
          console.error(
            "Something unwanted happened when querying profile: ",
            error
          );
        let employeeHistoryQuery =
          "SELECT * FROM employee_history WHERE year = ? AND month = ? AND e_id=?";
        connection.query(
          employeeHistoryQuery,
          [yearSelectedValue, monthSelectedValue, employeeSelectedValue],
          (error, historyRows) => {
            if (error)
              console.error(
                "Something unwanted happened when querying history: ",
                error
              );
            // console.log(historyRows, profileRows);
            let pFundAmt =
              parseFloat(profileRows[0].basic_salary) *
              parseFloat(profileRows[0].provident_fund / 100);

            let totalAddition =
              parseFloat(profileRows[0].basic_salary) +
              parseFloat(profileRows[0].food_allowance) +
              parseFloat(historyRows[0] ? historyRows[0].ot_amount : 0) +
              parseFloat(profileRows[0].fuel_allowance);

            let totalDeduction =
              parseFloat(pFundAmt) +
              parseFloat(profileRows[0].insurance) +
              parseFloat(historyRows[0].advance_amount);
            console.log(parseFloat(historyRows[0].advance_amount));
            $("#fullName").html(profileRows[0].name);
            $("#designation").html(profileRows[0].designation);
            $("#dateTime").html(monthSelectedText + ", " + yearSelectedValue);
            $("#basicScale").html(profileRows[0].basic_salary);
            $("#providentFund").html(pFundAmt);
            $("#foodAllowance").html(profileRows[0].food_allowance);
            $("#overTime").html(historyRows[0] ? historyRows[0].ot_amount : 0);
            $("#fuelAllowance").html(profileRows[0].fuel_allowance);
            $("#insuranceAmt").html(profileRows[0].insurance);
            $("#totalAddition").html(totalAddition);
            $("#totalDeduction").html(totalDeduction);
            $("#netSalary").html(
              parseFloat(totalAddition) - parseFloat(totalDeduction)
            );
          }
        ); // employee history query
      }
    );
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
