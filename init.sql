CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name) VALUES 
('Management'),
('Human Resources'),
('Front-End Developer'),
('Back-End Developer'),
('Project Manager'),
('UX/UI Designer'),
('UX Researcher'),
('Database Administrator'),
('QA Engineer'),
('DevOps Engineer'),
('Other');

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(50),
    lname VARCHAR(50),
    dob DATE,
    website VARCHAR(100),
    personal_email VARCHAR(100),
    personal_phone VARCHAR(20),
    work_email VARCHAR(100),
    work_phone VARCHAR(20),
    image VARCHAR(100),
    is_favorite BOOLEAN DEFAULT false,
    role_id INT REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contacts (fname, lname, dob, website, personal_email, personal_phone, work_email, work_phone, is_favorite, role_id) VALUES 
('Adam', 'Wong', '1990-01-01', 'https://example.com', 'lY8jH@example.com', '123-456-7890', 'lY8jH@example.com', '123-456-7890', true, 3),
('Tony', 'Stark', '1990-01-01', 'https://example.com', 'lY8jH@example.com', '123-456-7890', 'lY8jH@example.com', '123-456-7890', false, 5),
('Bruce', 'Wayne', '1990-01-01', 'https://example.com', 'lY8jH@example.com', '123-456-7890', 'lY8jH@example.com', '123-456-7890', false, 4),
('Ethan', 'Hunt', '1990-01-01', 'https://example.com', 'lY8jH@example.com', '123-456-7890', 'lY8jH@example.com', '123-456-7890', false, 4),
('Frank', 'Castle', '1990-01-01', 'https://example.com', 'lY8jH@example.com', '123-456-7890', 'lY8jH@example.com', '123-456-7890', false, 6),
('John', 'Wick', '1990-01-01', 'https://example.com', 'lY8jH@example.com', '123-456-7890', 'lY8jH@example.com', '123-456-7890', false, 11),
('Peter', 'Parker', '1990-01-01', 'https://example.com', 'lY8jH@example.com', '123-456-7890', 'lY8jH@example.com', '123-456-7890', false, 11),
('Tom', 'Smith', '1990-01-01', 'https://example.com', 'lY8jH@example.com', '123-456-7890', 'lY8jH@example.com', '123-456-7890', false, 9);