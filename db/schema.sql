  
DROP DATABASE IF EXISTS employeeTracker_DB;

CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

-- Department table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

-- Role Table
CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL(8,0) NOT NULL, 
    department_id INT NOT NULL, 
    PRIMARY KEY(id),
    FOREIGN KEY(department_id) REFERENCES department(id)
);

-- Employee Table
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);



-- Department Seeds
INSERT INTO department (name)
VALUE ("Marketing");

INSERT INTO department (name)
VALUE ("Engineering");

INSERT INTO department (name)
VALUE ("Sales");

INSERT INTO department (name)
VALUE ("Finance");

INSERT INTO department (name)
VALUE ("Human Resources");


-- Role Seeds
INSERT INTO role (title, salary, department_id)
VALUE ("Marketing Director", 125000, 1);

INSERT INTO role (title, salary, department_id)
VALUE ("Graphic Designer", 75000, 2);

INSERT INTO role (title, salary, department_id)
VALUE ("Web Developer", 100000, 3);

INSERT INTO role (title, salary, department_id)
VALUE ("Sales Rep", 65000, 4);

INSERT INTO role (title, salary, department_id)
VALUE ("Sales Manager", 85000, 5);

INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);

INSERT INTO role (title, salary, department_id)
VALUE ("Accounts Payable Clerk", 70000, 4);

INSERT INTO role (title, salary, department_id)
VALUE ("Accounts Receivable Clerk", 70000, 4);

INSERT INTO role (title, salary, department_id)
VALUE ("HR Generalist", 55500, 5);


-- Employee seeds
INSERT INTO employee (first_name, last_name, role_id)
VALUE ("Ron", "Burgundy", 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUE ("Veronica", "Corningstone", 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUE ("Brian","Fantana", 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUE ("Brick", "Tamland", 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUE ("Champ", "Kind",  5);

INSERT INTO employee (first_name, last_name, role_id)
VALUE ("Ed", "Harkin", 6);

INSERT INTO employee (first_name, last_name, role_id)
VALUE ("Garth", "Holliday", 7);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;