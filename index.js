const inquirer = require("inquirer");

const db = require("./db/connection");
const table = require("console.table");

let departmentData = [];
let employeeData = [];
let roleData = [];

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
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
        case "Add Employee":
          addEmployee();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
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

  function addEmployee() {
    const roleNames = getRoleNames();
    const managerNames = getManagerNames();

    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
          validate: (first_name) => {
            if (first_name) {
              return true;
            }
            return "Please enter a valid first name.";
          },
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?",
          validate: (last_name) => {
            if (last_name) {
              return true;
            }
            return "Please enter a valid last name.";
          },
        },
        {
          type: "list",
          name: "role_name",
          message: "What is the employee's role?",
          choices: roleNames,
        },
        {
          type: "list",
          name: "manager_name",
          message: "Who is the employee's manager?",
          choices: managerNames,
        },
      ])
      .then((answers) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        const getManagerId = employeeData.filter((x) => x.first_name + " " + x.last_name === answers.manager_name);
        const getRoleId = roleData.filter((x) => x.title === answers.role_name);
        const params = [answers.first_name, answers.last_name, getRoleId[0].id, getManagerId[0].id];

        db.query(sql, params, function (err, results) {
          if (err) throw err;

          loadEmployeeData();
          
          console.log("");
          menu();
        });
      });
  }

  function viewAllDepartments() {
    console.log("");
    console.table(departmentData);
    menu();
  }

  function viewAllRoles() {
    const sql = `SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, function (err, results) {
      if (err) throw err;

      console.log("");
      console.table(results);
      menu();
    });
  }
}

function loadDepartmentData() {
  const sql = `SELECT * FROM department`;

  db.query(sql, function (err, results) {
    if (err) throw err;

    for (i = 0; i < results.length; i++) {
      departmentData.push(results[i]);
    }
  });
}

function loadEmployeeData() {
  const sql = `SELECT * FROM employee`;

  db.query(sql, function (err, results) {
    if (err) throw err;

    for (i = 0; i < results.length; i++) {
      employeeData.push(results[i]);
    }
  });
}

function loadRoleData() {
  const sql = `SELECT * FROM role`;

  db.query(sql, function (err, results) {
    if (err) throw err;

    for (i = 0; i < results.length; i++) {
      roleData.push(results[i]);
    }
  });
}

function getRoleNames() {
  let roleArray = [];
  for (i = 0; i < roleData.length; i++) {
    roleArray.push(roleData[i].title);
  }
  return roleArray;
}

function getManagerNames() {
  let managerArray = [];
  let depFilter = departmentData.filter((x) => x.name === "Manager");
  let roleFiler = roleData.filter((x) => x.department_id === depFilter[0].id);
  for (i = 0; i < employeeData.length; i++) {
    if (employeeData[i].role_id === roleFiler[0].id) {
      managerArray.push(employeeData[i].first_name + " " + employeeData[i].last_name);
    }
  }
  return managerArray;
}

loadDepartmentData();
loadEmployeeData();
loadRoleData();
menu();
