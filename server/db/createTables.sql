USE works_for_students;
DROP TABLE IF EXISTS guidance;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS problem;
DROP TABLE IF EXISTS application;
DROP TABLE IF EXISTS job;
DROP TABLE IF EXISTS job_category;
DROP TABLE IF EXISTS spoken_language;
DROP TABLE IF EXISTS language;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS company;

CREATE TABLE IF NOT EXISTS company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(50),
    location VARCHAR(60) NOT NULL,
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
    flag VARCHAR(10) NOT NULL,
	company_id INT,
	banned BOOLEAN DEFAULT FALSE,
	FOREIGN KEY (company_id) REFERENCES company(id)
);

CREATE TABLE IF NOT EXISTS student (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT UNIQUE,
	university_name VARCHAR(30),
	year INT NOT NULL,
	cv_filename VARCHAR(30),   -- valahol a file-ok kozott a cv-ket
	mother_tongue VARCHAR(30),
	experience TEXT,   -- leirasok eddigi tapasztalatokrol
	presentation TEXT,   -- bemutatkozo szoveg
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS language (
	language_id INT AUTO_INCREMENT PRIMARY KEY,
	language_name VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS spoken_language (
	id INT AUTO_INCREMENT PRIMARY KEY,
	student_id INT,
	language_id INT,
	level VARCHAR(3),
	FOREIGN KEY (student_id) REFERENCES user(id),
	FOREIGN KEY (language_id) REFERENCES language(language_id)
);

CREATE TABLE IF NOT EXISTS job_category (
	id INT AUTO_INCREMENT PRIMARY KEY,
	category_name VARCHAR(50),
	description TEXT
);

CREATE TABLE IF NOT EXISTS job (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TEXT,    -- altalanos munkaleiras
    requirements TEXT,   -- elvarasok
    salary INT NULL,
    company_id INT NOT NULL,
    category_id INT,  
	working_hours VARCHAR(20) NOT NULL,  -- hany orat kene dolgozni (hetente)
	application_limit INT,
    FOREIGN KEY (company_id) REFERENCES company(id),
    FOREIGN KEY (category_id) REFERENCES job_category(id)
);

CREATE TABLE IF NOT EXISTS application (
	id INT AUTO_INCREMENT PRIMARY KEY,
	date_application TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	student_id INT NOT NULL,
	job_id INT NOT NULL,
	accept BOOLEAN,
	message TEXT,
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