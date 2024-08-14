USE works_for_students;
DROP TABLE IF EXISTS guidance;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS problem;
DROP TABLE IF EXISTS application;
DROP TABLE IF EXISTS job;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS spoken_language;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS language;
DROP TABLE IF EXISTS university;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS company;

CREATE TABLE IF NOT EXISTS company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(50),
	email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
	tel_number VARCHAR(12),
    location VARCHAR(60),
	flag VARCHAR(2) NOT NULL,
    banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating INT DEFAULT 0        -- lenne egy ful, ahol lehet ertekelni a ceget
);

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
	username VARCHAR(30),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag VARCHAR(2) NOT NULL,
	company_id INT,
	banned BOOLEAN DEFAULT FALSE,
	FOREIGN KEY (company_id) REFERENCES company(id)
);

CREATE TABLE IF NOT EXISTS university (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS language (
	language_id INT AUTO_INCREMENT PRIMARY KEY,
	language_name VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    university_id INT,
    birthday_date DATE,
    cv_filename VARCHAR(30),  
    mother_tongue_id INT,
    presentation TEXT,  
    CNP VARCHAR(13),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (university_id) REFERENCES university(id),
    FOREIGN KEY (mother_tongue_id) REFERENCES language(language_id)
);

CREATE TABLE IF NOT EXISTS spoken_language (
	id INT AUTO_INCREMENT PRIMARY KEY,
	student_id INT,
	language_id INT,
	level VARCHAR(3),
	FOREIGN KEY (student_id) REFERENCES user(id),
	FOREIGN KEY (language_id) REFERENCES language(language_id)
);

CREATE TABLE IF NOT EXISTS department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(50),
    description TEXT
);

CREATE TABLE IF NOT EXISTS job (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TEXT,    
    requirements TEXT,   
    salary INT NULL,
    company_id INT NOT NULL,
    department_id INT,  
    working_hours VARCHAR(20) NOT NULL,  
    application_limit INT,
    FOREIGN KEY (company_id) REFERENCES company(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE IF NOT EXISTS application (
	id INT AUTO_INCREMENT PRIMARY KEY,
	date_application TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	student_id INT NOT NULL,
	job_id INT NOT NULL,
	accept BOOLEAN,
	message TEXT,
	response TEXT,
	UNIQUE KEY (student_id, job_id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (job_id) REFERENCES job(id)
);

CREATE TABLE IF NOT EXISTS problem (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	description TEXT,
	solved BOOLEAN,
	FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS notification (  -- valaszok a cegektol (hr-tol)
	id INT AUTO_INCREMENT PRIMARY KEY,
	message TEXT, 
	from_member INT NOT NULL,
	to_member INT NOT NULL,
	FOREIGN KEY (from_member) REFERENCES user(id),
	FOREIGN KEY (to_member) REFERENCES user(id)
);
	 
CREATE TABLE IF NOT EXISTS guidance (  -- works_for_studentscegnek kuldeni valamit
	id INT AUTO_INCREMENT PRIMARY KEY,
	text TEXT NOT NULL,
	file_name VARCHAR(20),
	company_id INT NOT NULL,
	FOREIGN KEY(company_id) REFERENCES company(id)
);

SHOW TABLES;