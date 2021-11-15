INSERT INTO department (name)
VALUES
    ("Back of House"),
    ("Front of House"),
    ("Manager");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Prep Cook", "1500", 1),
    ("Cook", "2000", 1),
    ("Dishwasher", "2000", 1),
    ("Busser", "3000", 2),
    ("Host", "3000", 2),
    ("Server", "5000", 2),
    ("Helm", "200000", 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Frank", "Smith", 7, NULL),
    ("Victoria", "Valin", 7, NULL),
    ("Albert", "Win", 1, 1),
    ("Jim", "Carry", 2, 1),
    ("Sam", "Nibble", 2, 1),
    ("Donald", "Duck", 2, 2),
    ("Justin", "Bieber", 3, 1),
    ("David", "Dobrik", 4, 2),
    ("Zane", "Miles", 5, 1),
    ("Sierra", "Scott", 6, 2),
    ("Raevyn", "Nichole", 6, 1),
    ("Dani", "Franko", 6, 2),
    ("Jacob", "Meier", 6, 2),
    ("Chris", "Falberry", 6, 1);
