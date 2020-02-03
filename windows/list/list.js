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
    let status = true;
    // ipcRenderer.send("employee-list", rows, status);
    for (let i = 0; i < rows.length; i++) {
      var row = empTable.insertRow(1); //table element kata define vako cha?
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);
      var cell8 = row.insertCell(7);
      var cell9 = row.insertCell(8);

      // create details button
      var button = document.createElement("input");
      button.setAttribute("type", "button");
      button.setAttribute("name", "Details");
      button.setAttribute("value", "Details");
      button.setAttribute("class", "btn btn-success details-btn");
      button.setAttribute("id", rows[i].id);

      // create edit button
      var editButton = document.createElement("input");
      editButton.setAttribute("type", "button");
      editButton.setAttribute("name", "Edit");
      editButton.setAttribute("value", "Edit");
      editButton.setAttribute("class", "btn btn-primary edit-btn lg");
      editButton.setAttribute("id", rows[i].id);

      // create delete button
      var deleteButton = document.createElement("input");
      deleteButton.setAttribute("type", "button");
      deleteButton.setAttribute("name", "Delete");
      deleteButton.setAttribute("value", "Delete");
      deleteButton.setAttribute("class", "btn btn-danger edit-btn lg");
      deleteButton.setAttribute("id", rows[i].id);

      cell1.innerHTML = i + 1;
      cell2.innerHTML = rows[i].name;
      cell3.innerHTML = rows[i].designation;
      cell4.innerHTML = rows[i].email;
      cell5.innerHTML = rows[i].contact_number;
      cell6.innerHTML = rows[i].address;
      cell7.appendChild(button);
      cell8.appendChild(editButton);
      cell9.appendChild(deleteButton);

      button.addEventListener("click", event => {
        event.preventDefault();
        // console.log(event.target.id);
        handleDetailsButton(event.target.id);
      });

      editButton.addEventListener("click", event => {
        event.preventDefault();
        // console.log(event.target.id);
        handleEditButton(event.target.id);
      });

      deleteButton.addEventListener("click", event => {
        event.preventDefault();
        // console.log(event.target.id);
        handleDeleteButton(event.target.id);
      });
    }
  }
});

// ipcRenderer.on("list-received", (event, rows) => {});

handleDetailsButton = id => {
  // console.log("clicked button id is ", id);
  ipcRenderer.send("employee-details-id", id);
};

handleEditButton = id => {
  ipcRenderer.send("employee-edit-id", id);
};

handleDeleteButton = id => {
  ipcRenderer.send("handleDelete", id);
  ipcRenderer.on("deleteApproved", () => {
    $query = "DELETE  FROM employee_profile WHERE id=?";
    connection.query($query, [id], (error, rows, field) => {
      if (error) {
        console.log("error connecting db");
      }
      location.reload();
    });
  });
};

let openReportWindow = document.getElementById("gReport");
openReportWindow.addEventListener("click", e => {
  e.preventDefault();
  ipcRenderer.send("openReportWindow");
});

let addEmployeeBtn = document.getElementById("addEmployee");
addEmployeeBtn.addEventListener("click", e => {
  e.preventDefault();
  let test = true;
  ipcRenderer.send("open-add-employee", test);
});

let generateSalary = document.getElementById("generateSalary");
generateSalary.addEventListener("click", e => {
  e.preventDefault();
  ipcRenderer.send("open-generate-salary");
});

ipcRenderer.on("rowAdded", () => {
  location.reload();
});
