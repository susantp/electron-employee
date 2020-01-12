const { ipcRenderer } = require("electron");
const connection = require("./../../service/db-connection");
const app = require("electron").remote.app;

ipcRenderer.on("employee-id", (event, id) => {
  console.log("id from employee details", id);
  let $query = `SELECT * FROM employee_profile WHERE id=?`;

  connection.query($query, [id], (erro, rows, field) => {
    ipcRenderer.send("selected-employee-details", rows);
    document.getElementById("fullname").innerHTML = rows[0].name;
    document.getElementById("pm").innerHTML = rows[0].designation;
    document.getElementById("joinedDate").innerHTML = rows[0].joined_date;
    if (
      rows[0].image === "undefined" ||
      rows[0].image === "" ||
      rows[0].image === null
    ) {
      document.getElementById("profImg").src = __dirname + "/placeholder.png";
    } else {
      document.getElementById("profImg").src =
        app.getAppPath() + "/windows/add/images/" + rows[0].image;
    }
  });

  let selectedElement = document.getElementById("select");

  selectedElement.addEventListener("change", function(event) {
    event.preventDefault();
    let selectedYear =
      selectedElement.options[selectedElement.selectedIndex].value;
    console.log("selected value is " + selectedYear);
  });
});
