const { remote, ipcRenderer } = require("electron");
var mysql = require("mysql");

const empTable = document.getElementById("empTable");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  database: "crupee-salary-meter"
});

connection.connect(function(err) {
  if (err) {
    console.log(err.code);
    console.log(err.fatal);
  }
});

// getting the list of employee
$queryList = "SELECT * FROM employee_profile";
connection.query($queryList, (err, rows, field) => {
  if (rows.length > 0) {
    status = true;
    // ipcRenderer.send("employee-list", rows, status);
    for (i = 0; i < rows.length; i++) {
      var row = empTable.insertRow(1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      // create button
      var button = document.createElement("input");
      button.setAttribute("type", "button");
      button.setAttribute("name", "Details");
      button.setAttribute("value", "Details");
      button.setAttribute("class", "btn btn-success details-btn");
      button.setAttribute("id", rows[i].id);

      cell1.innerHTML = rows[i].name;
      cell2.innerHTML = rows[i].designation;
      cell3.innerHTML = rows[i].email;
      cell4.innerHTML = rows[i].contact_number;
      cell5.innerHTML = rows[i].address;
      cell6.appendChild(button);
      //   var id = document.getElementsByTagName("button")[1].getAttribute("id");
      button.addEventListener("click", event => {
        event.preventDefault();
        // console.log(event.target.id);
        handleDetailsButton(event.target.id);
      });
    }
  }
});

// ipcRenderer.on("list-received", (event, rows) => {});

handleDetailsButton = id => {
  console.log("clicked button id is ", id);
  ipcRenderer.send("employee-details-id", id);
};

var addEmployeeBtn = document.getElementById("addEmployee");
addEmployeeBtn.addEventListener("click", e => {
  e.preventDefault();
  test = true;
  ipcRenderer.send("open-add-employee", test);
});
