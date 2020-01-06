const { ipcRenderer } = require("electron");
const connection = require("./../../service/db-connection");

ipcRenderer.on("employee-id", (event, id) => {
  console.log("id from employee details", id);
  $query = `SELECT * FROM employee_profile WHERE id=?`;

  connection.query($query, [id], (erro, rows, field) => {
    console.log("the clicked row is ", rows);
    ipcRenderer.send("selected-employee-details", rows[0].name);
    console.log(rows[0].name);
  });
});
