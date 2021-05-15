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
      message: 'Welcome to the company department & employee database. What would you like to do?',
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
        viewRoles();
      } else if (answer.initialQuestion === 'View Employees') {
        viewEmployees();
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
          name: answer.newDepartment
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
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.log('DEPARTMENTS:')
    console.table(res);
    // re-prompt the user with the initial question
    start();
  });
};


// function to handle View Roles answer for the user
function viewRoles() {
  // query the database for all roles
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.log('Company Roles:')
    console.table(res);
    // re-prompt the user with the initial question
    start();
  });
};


// function to handle View Employees answer for the user
function viewEmployees() {
  // query the database for all employees
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.log('Company Roster:')
    console.table(res);
    // re-prompt the user with the initial question
    start();
  });
};


// function to handle Add Role answers from the user
const addRole = () => {
  const sql = "SELECT * FROM department";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    // prompt for info about new role
    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Please provide a title for this new role you would like to add to your company?',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'Please provide a salary for this role:',
          validate: function (value) {
            var pass = Number.isInteger(+value)
            if (pass) {
              return true;
            }
            return 'Please make sure the salary is a number.'
          },
        },
        {
          name: 'department',
          type: 'list',
          choices: () => {
            let options = [];
            for (let i = 0; i < res.length; i++) {
              options.push(res[i].name);
            }
            return options;
          },
          message: 'Please advise what department this role is in'
        }
      ])
      .then((answer) => {
        // inserts a new role & salary into the database
        let dept;
        for (let i = 0; i < res.length; i++) {
          if (res[i].name === answer.department) {
            dept = res[i];
          }
        }
        connection.query(
          'INSERT INTO role SET ?',
          {
            title: answer.title,
            salary: answer.salary,
            department_id: dept.id
          },
          (err) => {
            if (err) throw err;
            console.log('This new role has been added to the company database.');
            // re-prompt the user with the initial question
            start();
          }
        );
      });
  });
};


// function to handle Add Employee answers from the user
const addEmployee = () => {
  const sql = "SELECT * FROM employee, role";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    // prompt for info about new role
    inquirer
      .prompt([
        {
          name: 'first',
          type: 'input',
          message: 'Please provide a first name for this new employee:',
        },
        {
          name: 'last',
          type: 'input',
          message: 'Please provide a last name for this new employee:',
        },
        {
          name: 'role',
          type: 'list',
          choices: () => {
            let options = [];
            for (let i = 0; i < res.length; i++) {
              options.push(res[i].title);
            }
            let selectOptions = [...new Set(options)];
            return selectOptions;
          },
          message: 'Please provide a role/title for this new employee:',
        },
      ])
      .then((answer) => {
        // inserts a employee into the database
        let employeeRole;
        for (let i = 0; i < res.length; i++) {
          if (res[i].title === answer.role) {
            employeeRole = res[i];
          }
        }
        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: answer.first,
            last_name: answer.last,
            role_id: employeeRole.id,
          },
          (err) => {
            if (err) throw err;
            console.log('This new role has been added to the company database.');
            // re-prompt the user with the initial question
            start();
          }
        );
      });
  });
};

// function to handle Employee Role Update answers from the user
const updateEmployee = () => {
  const sql = "SELECT * FROM employee, role";
  connection.query(sql, (err, res) => {
    if (err) throw err;
    // prompt for info about updated employee role
    inquirer
      .prompt([
        {
          name: 'employee',
          type: 'list',
          choices: () => {
            let options = [];
            for (let i = 0; i < res.length; i++) {
              options.push(res[i].last_name);
            }
            let selectOptions = [...new Set(options)];
            return selectOptions;
          },
          message: 'Which employee would you like to update?',
        },
        {
          name: 'role',
          type: 'list',
          choices: () => {
            let options = [];
            for (let i = 0; i < res.length; i++) {
              options.push(res[i].title);
            }
            let selectOptions = [...new Set(options)];
            return selectOptions;
          },
          message: 'Please provide an updated role/title for this employee:',
        },
      ])
      .then((answer) => {
        // inserts a employee's new info into the database
        let employeeUpdate;
        let newTitle;
        for (let i = 0; i < res.length; i++) {
          if (res[i].title === answer.role) {
            newTitle = res[i];
          }
        }
        for (let i = 0; i < res.length; i++) {
          if (res[i].last_name === answer.employee) {
            employeeUpdate = res[i];
          }
        }
        connection.query(
          'UPDATE employee SET ? WHERE ?', [
          {
            last_name: employeeUpdate,
          },
          {
            role_id: newTitle,
          }],
          (err) => {
            if (err) throw err;
            console.log("This employee's role has been updated in the company database.");
            // re-prompt the user with the initial question
            start();
          }
        );
      });
    });
  };


    // connect to the mysql server and sql database
    connection.connect((err) => {
      if (err) throw err;
      // run the start function after the connection is made to prompt the user
      start();
    });
