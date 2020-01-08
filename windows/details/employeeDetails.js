const { ipcRenderer } = require("electron");
const connection = require("./../../service/db-connection");

ipcRenderer.on("employee-id", (event, id) => {
  console.log("id from employee details", id);
  $query = `SELECT * FROM employee_profile WHERE id=?`;

  connection.query($query, [id], (erro, rows, field) => {
    console.log("the clicked row is ", rows);
    ipcRenderer.send("selected-employee-details", rows);
    console.log(rows[0].name);

    document.getElementById("fullname").innerHTML = rows[0].name;
    document.getElementById("pm").innerHTML = rows[0].designation;
    document.getElementById("joinedDate").innerHTML = rows[0].joined_date;
  });
  var selectedElement = document.getElementById("select");

  selectedElement.addEventListener("change", function(event) {
    event.preventDefault();
    var selectedYear =
      selectedElement.options[selectedElement.selectedIndex].value;
    console.log("selected value is " + selectedYear);
  });
});
