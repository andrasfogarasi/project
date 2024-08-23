USE works_for_students;

IF OBJECT_ID('guidance', 'U') IS NOT NULL DROP TABLE guidance;
IF OBJECT_ID('notification', 'U') IS NOT NULL DROP TABLE notification;
IF OBJECT_ID('problem', 'U') IS NOT NULL DROP TABLE problem;
IF OBJECT_ID('application', 'U') IS NOT NULL DROP TABLE application;
IF OBJECT_ID('job', 'U') IS NOT NULL DROP TABLE job;
IF OBJECT_ID('department', 'U') IS NOT NULL DROP TABLE department;
IF OBJECT_ID('spoken_language', 'U') IS NOT NULL DROP TABLE spoken_language;
IF OBJECT_ID('student', 'U') IS NOT NULL DROP TABLE student;
IF OBJECT_ID('language', 'U') IS NOT NULL DROP TABLE language;
IF OBJECT_ID('university', 'U') IS NOT NULL DROP TABLE university;
IF OBJECT_ID('user', 'U') IS NOT NULL DROP TABLE [user];
IF OBJECT_ID('company', 'U') IS NOT NULL DROP TABLE company;

CREATE TABLE company (
    id INT IDENTITY(1,1) PRIMARY KEY,
    company_name VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE [user] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(30),
    email VARCHAR(100) NOT NULL UNIQUE,
);

CREATE TABLE university (
    id INT IDENTITY(1,1) PRIMARY KEY,
    university_name VARCHAR(50)
);

CREATE TABLE language (
    language_id INT IDENTITY(1,1) PRIMARY KEY,
    language_name VARCHAR(30)
);

CREATE TABLE student (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT UNIQUE FOREIGN KEY REFERENCES [user](id),
    university_id INT FOREIGN KEY REFERENCES university(id),
    university_course VARCHAR(20),
	cv_filename VARCHAR(30)
);

CREATE TABLE spoken_language (
    id INT IDENTITY(1,1) PRIMARY KEY,
    student_id INT FOREIGN KEY REFERENCES student(id),
    language_id INT FOREIGN KEY REFERENCES language(language_id)
);

CREATE TABLE department (
    id INT IDENTITY(1,1) PRIMARY KEY,
    department_name VARCHAR(50)
);

CREATE TABLE job (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    company_id INT NOT NULL FOREIGN KEY REFERENCES company(id),
    department_id INT FOREIGN KEY REFERENCES department(id)
);

CREATE TABLE application (
    id INT IDENTITY(1,1) PRIMARY KEY,
    student_id INT NOT NULL FOREIGN KEY REFERENCES student(id),
    job_id INT NOT NULL FOREIGN KEY REFERENCES job(id),
    accept BIT
);

CREATE TABLE problem (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES [user](id),
    description TEXT,
    solved BIT
);

SELECT * FROM sys.tables;
