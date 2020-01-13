const { ipcRenderer } = require("electron");
const connection = require("./../../service/db-connection");
const app = require("electron").remote.app;

$(document).ready(function(event) {
  // selected user id
  var selectedUserId;

  // selected year
  var selectedYear;

  // get selected employee details
  ipcRenderer.on("employee-id", (event, id) => {
    $("#table").hide();
    if (id) {
      selectedUserId = id;
    }

    console.log("id from employee details", selectedUserId);

    let $query = `SELECT * FROM employee_profile WHERE id=?`;

    connection.query($query, [selectedUserId], (error, rows, field) => {
      if (error) console.log("error occur getting data ", error);
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit"
      };
      ipcRenderer.send("selected-employee-details", rows);

      document.getElementById(
        "salaryDetails"
      ).innerHTML = `Salary Details of ${rows[0].name}`;
      document.getElementById("fullname").innerHTML = rows[0].name;
      document.getElementById("designation").innerHTML = rows[0].designation;
      var date = rows[0].joined_date.toLocaleDateString("en-US", options);
      document.getElementById("joinedDate").innerHTML = date;
      document.getElementById("email").innerHTML = rows[0].email;
      document.getElementById("address").innerHTML = rows[0].address;
      document.getElementById("contactNumber").innerHTML =
        rows[0].contact_number;
      document.getElementById("dob").innerHTML = rows[0].dob;

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

    // on selection of year
    var selectedElement = document.getElementById("select");

    selectedElement.addEventListener("change", function(event) {
      event.preventDefault();
      selectedYear =
        selectedElement.options[selectedElement.selectedIndex].value;
      console.log("selected value is " + selectedYear);

      $quer1 = "SELECT * FROM employee_history WHERE e_id=? AND year=?";
      if (selectedYear != "selected value is " && selectedUserId != null) {
        connection.query(
          $quer1,
          [selectedUserId, selectedYear],
          (error, rows, field) => {
            if (error) console.log("error getting history from db ", error);
            if (rows.length >= 1) {
              console.log("db connected successfully ", rows.length);
            }
          }
        );
      }
    });

    test1 = () => {
      console.log(
        "selected id is " + selectedUserId + "selected year is " + selectedYear
      );
    };
  });

  // end
});
