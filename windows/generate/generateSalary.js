const { ipcRenderer, dialog } = require("electron");
const connection = require("./../../service/db-connection");

$(document).ready(function() {
  var selectedElement = document.getElementById("selectEmployee");
  var selectedUserId;
  var selectedYear;
  var selectedMonth;
  var totalWorkingHours;
  var totalPresentHours;
  var basicSalary;
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
        $("#basicSalary").val(rows[0].basic_salary);
        basicSalary = $("#basicSalary").val();
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
    const hoursExcluding = totalPresentHours - absentHours;
    totalHoursExcluding = hoursExcluding;
    $("#totalHoursExcluding").html(
      `Total hours after excluding ${totalHoursExcluding}`
    );
    console.log("total hours excluding ", totalHoursExcluding);
  });

  // on user select retrieve from database

  // test function
  // test1 = () => {
  //   console.log(" selected user id is ", basicSalary);
  // };
});
