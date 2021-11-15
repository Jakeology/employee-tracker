const inquirer = require("inquirer");

const db = require("./db/connection");
const table = require("console.table");
const { up } = require("inquirer/lib/utils/readline");

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
          "View All Departments",
          "Add Department",
          "View All Roles",
          "Add Role",
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
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
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
          when: ({ role_name }) => {
            const getRoleId = roleData.filter((x) => x.title === role_name);
            let depFilter = departmentData.filter((x) => x.name === "Manager");
            if (getRoleId[0].department_id === depFilter[0].id) {
              return false;
            } else {
              return true;
            }
          },
        },
      ])
      .then((answers) => {
        let params;
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        const getRoleId = roleData.filter((x) => x.title === answers.role_name);

        if(answers.manager_name === undefined || answers.manager_name === null) {
          params = [answers.first_name, answers.last_name, getRoleId[0].id, null];
        } else {
          let getManagerId = employeeData.filter((x) => x.first_name + " " + x.last_name === answers.manager_name);
          params = [answers.first_name, answers.last_name, getRoleId[0].id, getManagerId[0].id];
        }

        db.query(sql, params, function (err, results) {
          if (err) throw err;

          loadEmployeeData();

          console.log("");
          menu();
        });
      });
  }

  function updateEmployeeRole() {
    const employeeNames = getEmployeeNames();
    const roleNames = getRoleNames();

    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_name",
          message: "What is the employee's name?",
          choices: employeeNames,
        },
        {
          type: "list",
          name: "role_name",
          message: "What is the employee's new role?",
          choices: roleNames,
        },
      ])
      .then((answers) => {
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        let em = answers.employee_name.split(" ");
        const getEmployeeId = employeeData.filter((x) => x.first_name == em[0] && x.last_name == em[1]);
        const getRoleId = roleData.filter((x) => x.title === answers.role_name);
        const params = [getRoleId[0].id, getEmployeeId[0].id];

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

  function addDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "department_name",
          message: "What is the new departments name?",
          validate: (department_name) => {
            if (department_name) {
              return true;
            }
            return "Please enter a valid department name.";
          },
        },
      ])
      .then((answers) => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        const params = [answers.department_name];

        db.query(sql, params, function (err, results) {
          if (err) throw err;

          loadDepartmentData();

          console.log("");
          menu();
        });
      });
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

  function addRole() {
    inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the new role's title?",
        validate: (title) => {
          if (title) {
            return true;
          }
          return "Please enter a valid role name.";
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of this new role?",
        validate: (salary) => {
          if (salary) {
            return true;
          }
          return "Please enter a valid role salary.";
        },
      },
      {
        type: "list",
        name: "department_name",
        message: "What is the roles department?",
        choices: departmentData,
      },
    ])
    .then((answers) => {
      const depFilter = departmentData.filter((x) => x.name === answers.department_name);

      const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
      const params = [answers.title, answers.salary, depFilter[0].id];

      db.query(sql, params, function (err, results) {
        if (err) throw err;

        loadRoleData();

        console.log("");
        menu();
      });
    });
  }
}

function loadDepartmentData() {
  departmentData = [];
  const sql = `SELECT * FROM department`;

  db.query(sql, function (err, results) {
    if (err) throw err;

    for (i = 0; i < results.length; i++) {
      departmentData.push(results[i]);
    }
  });
}

function loadEmployeeData() {
  employeeData = [];
  const sql = `SELECT * FROM employee`;

  db.query(sql, function (err, results) {
    if (err) throw err;

    for (i = 0; i < results.length; i++) {
      employeeData.push(results[i]);
    }
  });
}

function loadRoleData() {
  roleData = [];
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

function getEmployeeNames() {
  let employeeArray = [];

  for (i = 0; i < employeeData.length; i++) {
    employeeArray.push(employeeData[i].first_name + " " + employeeData[i].last_name);
  }

  return employeeArray;
}

loadDepartmentData();
loadEmployeeData();
loadRoleData();
menu();
