const { ipcRenderer, dialog } = require("electron");
const connection = require("./../../service/db-connection");

$(document).ready(function() {
  var selectedElement = document.getElementById("select");
  var selectedUserId;
  var selectedYear;
  var selectedMonth;
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
  }
});
