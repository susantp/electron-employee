const electron = require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const connection = require("./../../service/db-connection");

// getting the list of employee
$queryList = "SELECT * FROM employee_profile";
connection.query($queryList, (err, rows, field) => {
  if (rows.length > 0) {
    status = true;
    // ipcRenderer.send("employee-list", rows, status);
    for (let i = 0; i < rows.length; i++) {
      let row = empTable.insertRow(1);
      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);
      let cell4 = row.insertCell(3);
      let cell5 = row.insertCell(4);
      let cell6 = row.insertCell(5);
      // create button
      let button = document.createElement("input");
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

let addEmployeeBtn = document.getElementById("addEmployee");
addEmployeeBtn.addEventListener("click", e => {
  e.preventDefault();
  let test = true;
  ipcRenderer.send("open-add-employee", test);
});

let generateSalary = document.getElementById("generateSalary");
generateSalary.addEventListener("click", e => {
  e.preventDefault();
  let test = true;
  ipcRenderer.send("open-generate-salary", test);
});
