const { ipcRenderer, remote } = require("electron");
const { dialog } = require("electron").remote;
const connection = require("./../../service/db-connection");
ipcRenderer.on("came-from-list", () => {
  location.reload();
});
$(document).ready(function() {
  var selectedElement = document.getElementById("selectEmployee");
  // selected employee
  var selectedUserId;

  // selected year for generating salary
  var selectedYear;

  // selected month for generating salary
  var selectedMonth;

  // total working days*8
  var totalWorkingHours;

  // hours after deducting absent hours
  var totalPresentHours;

  // net present hours
  var totalHoursExcluding;
  // basic salary of employee
  var basicSalary;

  // provident fund of selected employee
  var pf;

  // insurance of selected employee
  var insurance;

  // fuel allowance of selected employee
  var fuelAllowance;

  // food allowance of selected employee
  var foodAllowance;

  // each hour salary of total working days
  var eachHourSalary;

  // total net salary of of present hours
  var netSalary;

  // total over time amount
  var otAmount;

  // salary adding ot amount on net salary
  var netSalaryAddingOt;

  // salary after deducting pf on total net salary
  var salaryDeductingPf;

  // salary after deducting insurance on salary after deducting pf
  var salaryDeductingInsurance;

  // salary adding food allowance
  var salaryAddingFood;

  // salary adding fuel allowance
  var salaryAddingFuel;

  // advance amount
  var advanceAmount;

  // grandTotalSalary
  var grandTotalSalary;

  const employeeList = "SELECT * FROM employee_profile";
  //   get all employee from table and add it to dropdown
  connection.query(employeeList, (error, rows, field) => {
    if (error) console.log("error occured connectind database");

    for (var i = 0; i < rows.length; i++) {
      $("<option/>")
        .attr("value", rows[i].id)
        .html(rows[i].name)
        .appendTo(selectedElement);
    }
  });

  // when employee dropdown changed
  selectedElement.addEventListener("change", makeSelectedUserIdGlobal, true);

  function makeSelectedUserIdGlobal(event) {
    var selectedValue =
      selectedElement.options[selectedElement.selectedIndex].value;
    selectedUserId = selectedValue;
    console.log("the value inside function ", selectedUserId);

    // set basic salary
    if (selectedUserId) {
      $query1 = "SELECT * FROM employee_profile WHERE id=? ";
      connection.query($query1, [selectedUserId], (error, rows, field) => {
        if (error) console.log("error occured connecting database ", error);
        var ebasicSalary = rows[0].basic_salary;
        $("#basicSalary").val(ebasicSalary);
        var ePf = rows[0].provident_fund;
        var eFoodAllowance = rows[0].food_allowance;
        var eFuelAllowance = rows[0].fuel_allowance;
        var eInsurance = rows[0].insurance;

        $("#fuelAllowance").val(eFuelAllowance);
        $("#foodAllowance").val(eFoodAllowance);
        $("#pf").val(ePf);
        $("#insurance").val(eInsurance);
        // set the basic info
        basicSalary = ebasicSalary;
        pf = ePf;
        insurance = eInsurance;
        fuelAllowance = eFuelAllowance;
        foodAllowance = eFoodAllowance;
      });
    }
  }

  //   when year dropdown changed
  var selectedYearElement = document.getElementById("selectYear");
  selectedYearElement.addEventListener("change", makeSelectedYearGlobal, true);

  function makeSelectedYearGlobal(event) {
    var selectedValue =
      selectedYearElement.options[selectedYearElement.selectedIndex].value;
    selectedYear = selectedValue;
    console.log("selected year ", selectedYear);
  }

  //   when select month drop down is changed
  var selectedMonthElement = document.getElementById("selectMonth");
  selectedMonthElement.addEventListener(
    "change",
    makeSelectedMonthGlobal,
    true
  );

  function makeSelectedMonthGlobal() {
    var selectedValue =
      selectedMonthElement.options[selectedMonthElement.selectedIndex].value;
    selectedMonth = selectedValue;
    console.log("selected month is ", selectedMonth);
  }

  //   total working days on key up
  $("#totalWorkingDays").keyup(function() {
    const totalWorkingHour = $("#totalWorkingDays").val();
    const workingHours = totalWorkingHour * 8;

    $("#totalWorkingHours").html(`Total working hours is  ${workingHours}`);
    totalWorkingHours = workingHours;

    // calculate each salary
    eachHourSalary = basicSalary / totalWorkingHours;
    if (!isFinite(eachHourSalary)) {
      eachHourSalary = 0;
      $("#eachHourSalary").val(`${eachHourSalary}`);
    } else {
      $("#eachHourSalary").val(`${eachHourSalary}`);
    }
    test1();
  });

  //   total present days on a key up
  $("#totalPresentDays").keyup(function() {
    const presentDays = $("#totalPresentDays").val();
    const presentHours = presentDays * 8;
    totalPresentHours = presentHours;
    $("#totalPresentHours").html(`Total present hours ${totalPresentHours} `);
    console.log("total present days ", totalPresentHours);
  });

  //   absent hours on key up
  $("#totalAbsentHour").keyup(function() {
    const absentHours = $("#totalAbsentHour").val();
    // total present days- absent hours
    const hoursExcluding = totalPresentHours - absentHours;
    totalHoursExcluding = hoursExcluding;
    $("#totalHoursExcluding").html(
      `Total hours after excluding ${totalHoursExcluding}`
    );
    console.log("total hours excluding ", totalHoursExcluding);
    netSalary = totalHoursExcluding * eachHourSalary;
    $("#netSalary").val(netSalary);
  });

  // OT amount on key up
  $("#otAmount").keyup(function() {
    otAmount = $("#otAmount").val();
    // salary adding ot amount
    netSalaryAddingOt = parseFloat(netSalary) + parseFloat(otAmount);
    $("#netSalaryAddingOt").val(netSalaryAddingOt);

    // salary deduction pf
    if (netSalaryAddingOt) {
      salaryDeductingPf =
        parseFloat(netSalaryAddingOt) -
        (parseFloat(pf) / 100) * parseFloat(netSalaryAddingOt);
      $("#salaryDeductingPf").val(salaryDeductingPf);
    }

    //salary deducting insurance
    if (salaryDeductingPf) {
      salaryDeductingInsurance = salaryDeductingPf - insurance;
      $("#salaryDeductingInsurance").val(salaryDeductingInsurance);
    }

    // salary adding food allowance
    if (salaryDeductingInsurance) {
      salaryAddingFood =
        parseFloat(salaryDeductingInsurance) + parseFloat(foodAllowance);
      $("#salaryAfterFood").val(salaryAddingFood);
    }

    // salary adding fuel allowance
    if (salaryAddingFood) {
      salaryAddingFuel =
        parseFloat(salaryAddingFood) + parseFloat(fuelAllowance);
      $("#salaryAfterFuel").val(salaryAddingFuel);
    }
  });

  // advance amount on key up
  $("#advanceAmount").keyup(function() {
    advanceAmount = $("#advanceAmount").val();
    if (salaryAddingFuel) {
      grandTotalSalary = salaryAddingFuel - advanceAmount;
      $("#grandTotalSalary").val(grandTotalSalary);
    }
  });

  // test function
  test1 = () => {
    console.log(
      " selected user id is ",
      basicSalary,
      insurance,
      pf,
      foodAllowance,
      fuelAllowance,
      eachHourSalary
    );
  };

  // when generate salary button clicked
  var generateButton = document.querySelector("#form");
  generateButton.addEventListener("submit", function(event) {
    event.preventDefault();
    // insert into employee history table
    $query =
      "INSERT INTO employee_history (e_id,year,month,working_hours, net_present_hours,ot_amount,advance_amount,net_salary,total_amount) VALUES (?,?,?,?,?,?,?,?,?)";
    connection.query(
      $query,
      [
        selectedUserId,
        selectedYear,
        selectedMonth,
        totalWorkingHours,
        totalHoursExcluding,
        otAmount,
        advanceAmount,
        netSalary,
        grandTotalSalary
      ],
      (error, rows, field) => {
        let gSalaryW;
        if (error) {
          console.log("error inserting the generate salary to table ", error);
        } else {
          gSalaryW = remote.getCurrentWindow();
          const options = {
            type: "info",
            buttons: ["Ok"],
            title: "Record Added.",
            message: "Successfully Added!!!",
            detail:
              "You have successfully added " + rows.affectedRows + " record."
          };
          dialog.showMessageBox(gSalaryW, options).then(resolve => {
            if (resolve.response === 0) {
              gSalaryW.hide();
            }
          });
        }
      }
    );
  });
  // end
});
