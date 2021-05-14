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
      // when finished prompting, insert a new department into the database with that info
      connection.query(
        'INSERT INTO department SET ?',
        {
          department: answer.addDepartment
        },
        (err) => {
          if (err) throw err;
          console.log('Your new department has been added to the company database.');
          // re-prompt the user with the initial question
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
    // re-prompt the user with the initial question
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
    // re-prompt the user with the initial question
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
    // re-prompt the user with the initial question
    start();
  });
};


 // function to handle Add Role answer for the user
 const addRole = () => {
  // prompt for info about new role
  inquirer
    .prompt([
      {
        name: 'newRole',
        type: 'input',
        message: 'Please provide a title for this new role you would like to add to your company?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Please provide a salary for this role:',
      },
      validate: function (value) {
        var pass = Number.isInteger(+value)
        if (pass) {
          return true;
        }
        return 'Please make sure the salary is a number.'
      },
    ])
    .then((answer) => {
      // inserts a new role & salary into the database
      const newRole = answers.newRole;
      const newSalary = answers.salary;
      connection.query(
        'INSERT INTO department SET ?',
        {
          role: answer.addRole
        },
        (err) => {
          if (err) throw err;
          console.log('This new role has been added to the company database.');
          // re-prompt the user with the initial question
          start();
        }
      );
    });
};


// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});