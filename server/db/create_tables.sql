USE works_for_students;
DROP TABLE IF EXISTS banned;
DROP TABLE IF EXISTS guidance;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS problem;
DROP TABLE IF EXISTS application;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS job_category;
DROP TABLE IF EXISTS company;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS role;

CREATE TABLE IF NOT EXISTS role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE
);

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS student (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 user_id INT UNIQUE,
	 university_name VARCHAR(30),
	 year INT NOT NULL,
	 cv_filename VARCHAR(30),
	 mother_tongue VARCHAR(30),
	 experience TEXT,
	 description TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(50),
    location VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating INT DEFAULT 0,
    user_id INT UNIQUE,  #az ember a cegtol
    FOREIGN KEY (user_id) REFERENCES user(id) 
);

CREATE TABLE IF NOT EXISTS job_category (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 category_name VARCHAR(50),
	 description Text
);

CREATE TABLE IF NOT EXISTS post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TEXT,
    requirements TEXT,
    salary INT,
    company_id INT NOT NULL,
    category_id INT,
    job_time VARCHAR(20) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES company(id),
    FOREIGN KEY (category_id) REFERENCES job_category(id)
);

CREATE TABLE IF NOT EXISTS application (
	 date_application TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	 student_id INT NOT NULL,
	 post_id INT NOT NULL,
	 accept BOOLEAN,
	 PRIMARY KEY (student_id, post_id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (post_id) REFERENCES post(id)
);

CREATE TABLE IF NOT EXISTS problem (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 user_id INT NOT NULL,
	 description TEXT,
	 solved BOOLEAN,
	 FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS notification (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 message TEXT, 
	 from_member INT NOT NULL,
	 to_member INT NOT NULL,
	 FOREIGN KEY (from_member) REFERENCES user(id),
	 FOREIGN KEY (to_member) REFERENCES user(id)
);
	 
CREATE TABLE IF NOT EXISTS guidance (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 text TEXT NOT NULL,
	 file_name VARCHAR(20),
	 company_id INT NOT NULL,
	 FOREIGN KEY(company_id) REFERENCES company(id)
);

CREATE TABLE IF NOT EXISTS banned (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 description TEXT,
	 user_id INT NOT NULL,
	 FOREIGN KEY(user_id) REFERENCES user(id)
);

SHOW TABLES;