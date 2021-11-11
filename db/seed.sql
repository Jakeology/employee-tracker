INSERT INTO department (name)
VALUES
    ("Kitchen"),
    ("Helm");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Cook", "2000", 1),
    ("Manager", "200000", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Frank", "Smith", 2, NULL),
    ("Victoria", "Valin", 2, NULL),
    ("Albert", "Win", 1, 2),
    ("Jim", "Carry", 1, 1),
    ("Sam", "Nibble", 1, 1);
