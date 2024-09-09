\c team_registry

INSERT INTO sector
    (sector_name)
    
VALUES
    ('Creative Services'),
    ('Innovation Lab'),
    ('Talent & Culture'),
    ('Regulatory Affairs');

INSERT INTO position
    (position_title, position_salary, sector_id)

VALUES
    ('Creative Director', 98000, 1),
    ('Content Strategist', 58000, 1),
    ('Innovation Manager', 110000, 2),
    ('UI/UX Specialist', 78000, 2),
    ('Culture Lead', 88000, 3),
    ('Talent Acquisition Specialist', 62000, 3),
    ('Regulatory Compliance Manager', 73000, 4),
    ('Corporate Counsel', 92000, 4);

INSERT INTO staff
    (given_name, surname, position_id, mentor_id)

VALUES
    ('Olivia', 'Peterson', 1, NULL),
    ('Liam', 'Morris', 2, 1),
    ('Noah', 'Wright', 3, NULL),
    ('Emma', 'Green', 4, 3),
    ('Sophia', 'Lopez', 5, NULL),
    ('James', 'Harrison', 6, 5),
    ('Ava', 'Walker', 7, NULL),
    ('Benjamin', 'Scott', 8, 7);
