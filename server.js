const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: '',
  database: 'employeeTracker_DB',
});


// First question which prompts the user for what action they would like to take
const start = () => {
  inquirer
    .prompt({
      name: 'initialQuestion',
      type: 'list',
      message: 'Welcome to the company employee database. What would you like to do?',
      choices: [
        'Add Department',
        'Add Role',
        'Add Employee',
        'View Departments',
        'View Roles',
        'View Employees',
        'Update Employee Role',
        'Exit'
      ],
    })

    .then((answer) => {
      // based on their answer, direct the user to the next step
      if (answer.initialQuestion === 'Add Department') {
        addDepartment();
      } else if (answer.initialQuestion === 'Add Role') {
        addRole();
      } else if (answer.initialQuestion === 'Add Employee') {
        addEmployee();
      } else if (answer.initialQuestion === 'View Departments') {
        viewDepartments();
      } else if (answer.initialQuestion === 'View Roles') {
        viewEmployees();
      } else if (answer.initialQuestion === 'View Employees') {
        viewRoles();
      } else if (answer.initialQuestion === 'Update Employee Role') {
        updateEmployee();
      } else {
        connection.end();
      }
    });
};


// function to handle Add Department answer for the user
const addDepartment = () => {
  // prompt for info about department
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is name of the department you would like to add?',
      },
    ])
    .then((answer) => {
      // when finished prompting, insert a new department into the db with that info
      connection.query(
        'INSERT INTO department SET ?',
        {
          department: answer.addDepartment
        },
        (err) => {
          if (err) throw err;
          console.log('Your new department has been added to the company database.');
          // re-prompt the user if they would like to 
          start();
        }
      );
    });
};


// function to handle View Departments answer for the user
function viewDepartments() {
  // query the database for all departments
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    console.log(`DEPARTMENTS:`)
    res.forEach(department => {
      console.log(`ID: ${department.id} | Name: ${department.name}`)
    })
    start();
  });
};

// function to handle View Roles answer for the user
function viewRoles() {
  // query the database for all roles
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    console.log(`ROLES:`)
    res.forEach(role => {
      console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
    })
    start();
  });
};

// function to handle View Employees answer for the user
function viewEmployees() {
  // query the database for all employees
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, res) {
    console.log(`EMPLOYEES:`)
    res.forEach(employee => {
      console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
    })
    start();
  });
};