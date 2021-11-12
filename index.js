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
          "View All Employees By Department",
          "View All Employees By Role",
          "Add Emnployee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View All Roles",
          "Add Role",
          "Remove Role",
          "View All Departments",
          "Add Department",
          "Remove Department",
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
    const sql = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON e.role_id = department.id`;

    db.query(sql, function (err, results, fields) {
      console.table(results); // results contains rows returned by server
      menu();
    });
  }
}

menu();
