const inquirer = require("inquirer");

const db = require("./db/connection");
const table = require("console.table");

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Emnployee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
        ],
      },
    ])
    .then((choice) => {
      switch (choice.menu) {
        case "View All Employees":
          viewAllEmployees();
          break;
      }
    });

  function viewAllEmployees() {
    const sql = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, function (err, results) {
      if (err) throw err;

      console.log("");
      console.table(results);
      menu();
    });
  }
}

function getByValue(arr, value) {
  for (i = 0; i < arr.length; i++) {
    if (arr[i].name == value) return arr[i];
  }
}

menu();
