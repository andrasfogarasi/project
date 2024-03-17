USE works_for_students;
DROP TABLE IF EXISTS banned;
DROP TABLE IF EXISTS guidance;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS problems;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS job_categories;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 user_id INT UNIQUE,
	 university_name VARCHAR(30),
	 YEAR INT NOT NULL,
	 cv_filename VARCHAR(30),
	 mother_tongue VARCHAR(30),
	 experience TEXT,
	 DESCRIPTION TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(50),
    location VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    RATING INT DEFAULT 0,
    user_id INT UNIQUE,  #az ember a cegtol
    FOREIGN KEY (user_id) REFERENCES users(id) 
);

CREATE TABLE IF NOT EXISTS job_categories (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 category_name VARCHAR(50),
	 DESCRIPTION Text
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description TEXT,
    requirements TEXT,
    salary INT,
    company_id INT NOT NULL,
    category_id INT,
    job_time VARCHAR(20) NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (category_id) REFERENCES job_categories(id)
);

CREATE TABLE IF NOT EXISTS applications (
    #id INT AUTO_INCREMENT PRIMARY KEY,
	 date_application TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	 student_id INT NOT NULL,
	 post_id INT NOT NULL,
	 accept BOOLEAN,
	 PRIMARY KEY (student_id, post_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS problems (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 user_id INT NOT NULL,
	 DESCRIPTION TEXT,
	 solved BOOLEAN,
	 FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 message TEXT, 
	 from_member INT NOT NULL,
	 to_member INT NOT NULL,
	 FOREIGN KEY (from_member) REFERENCES users(id),
	 FOREIGN KEY (to_member) REFERENCES users(id)
);
	 
CREATE TABLE IF NOT EXISTS guidance (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 text TEXT NOT NULL,
	 file_name VARCHAR(20),
	 company_id INT NOT NULL,
	 FOREIGN KEY(company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS banned (
	 id INT AUTO_INCREMENT PRIMARY KEY,
	 description TEXT,
	 user_id INT NOT NULL,
	 FOREIGN KEY(user_id) REFERENCES users(id)
);

SHOW TABLES;