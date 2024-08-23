import databaseConnection from './databaseConnection.js';
import * as db from './queries.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const password = process.env.DB_PASSWORD;

export const createTables = async () => {
    try {

        await databaseConnection.executeQuery('USE works_for_students;');

        await databaseConnection.executeQuery(`
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
        rating INT DEFAULT 0    
    );
    `);

        await databaseConnection.executeQuery(`
    CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        username VARCHAR(30),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        flag VARCHAR(10) NOT NULL,
        banned BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (company_id) REFERENCES company(id)
    );
    `);

        await databaseConnection.executeQuery(`
        CREATE TABLE IF NOT EXISTS university (
        id INT AUTO_INCREMENT PRIMARY KEY,
        university_name VARCHAR(50)
    );
    `);

        await databaseConnection.executeQuery(`
        CREATE TABLE IF NOT EXISTS language (
        language_id INT AUTO_INCREMENT PRIMARY KEY,
        language_name VARCHAR(30)
    );
    `);

        await databaseConnection.executeQuery(`
        CREATE TABLE IF NOT EXISTS student (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE,
        university_id INT,
        birthday_date DATE,
        cv_filename VARCHAR(30),  
        presentation TEXT,  
        CNP VARCHAR(13),
        university_course VARCHAR(20),
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (university_id) REFERENCES university(id)
    );
    `);

        await databaseConnection.executeQuery(`
    CREATE TABLE IF NOT EXISTS spoken_language (
	id INT AUTO_INCREMENT PRIMARY KEY,
	student_id INT,
	language_id INT,
	level VARCHAR(3),
	FOREIGN KEY (student_id) REFERENCES user(id),
	FOREIGN KEY (language_id) REFERENCES language(language_id)
    );
    `);

        await databaseConnection.executeQuery(`
        CREATE TABLE IF NOT EXISTS department (
        id INT AUTO_INCREMENT PRIMARY KEY,
        department_name VARCHAR(50),
        description TEXT
    );
    `);

        await databaseConnection.executeQuery(`
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
        working_type VARCHAR(40),
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES company(id),
        FOREIGN KEY (department_id) REFERENCES department(id)
        );
    `);

        await databaseConnection.executeQuery(`
        CREATE TABLE IF NOT EXISTS application (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date_application TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        student_id INT NOT NULL,
        job_id INT NOT NULL,
        accept BOOLEAN,
        message TEXT,
        response TEXT,
        UNIQUE KEY (student_id, job_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES student(id),
        FOREIGN KEY (job_id) REFERENCES job(id)
    );
    `);

        await databaseConnection.executeQuery(`
        CREATE TABLE IF NOT EXISTS problem (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        description TEXT,
        solved BOOLEAN,
        FOREIGN KEY (user_id) REFERENCES user(id)
    );
    `);

        await databaseConnection.executeQuery(`
        CREATE TABLE IF NOT EXISTS notification (  
        id INT AUTO_INCREMENT PRIMARY KEY,
        message TEXT, 
        from_member INT NOT NULL,
        to_member INT NOT NULL,
        FOREIGN KEY (from_member) REFERENCES user(id),
        FOREIGN KEY (to_member) REFERENCES user(id)
    );
    `);

        await databaseConnection.executeQuery(`
        CREATE TABLE IF NOT EXISTS guidance (  
        id INT AUTO_INCREMENT PRIMARY KEY,
        text TEXT NOT NULL,
        file_name VARCHAR(20),
        company_id INT NOT NULL,
        FOREIGN KEY(company_id) REFERENCES company(id)
    );
    `);

        const [departmentRows] = await db.countOfAllDepartments();
        if (departmentRows.count === 0) {
            await databaseConnection.executeQuery(`
            INSERT INTO department (department_name) VALUES
            ('Barista'),
            ('Frontend Developer'),
            ('Backend Developer'),
            ('Javascript Developer');
        `);
        }

        const [userRows] = await db.countOfAllUsers();
        if (userRows.count === 0) {
            const encryptedPassword = await bcrypt.hash(password, 10);
            await databaseConnection.executeQuery(`
            INSERT INTO user (email, password, flag) VALUES
            ('admin@admin.com', '${encryptedPassword}','1');
        `);
        }

        const [languageRows] = await db.countOfAllLanguages();
        if (languageRows.count === 0) {
            await databaseConnection.executeQuery(`
            INSERT INTO language (language_name) VALUES
            ('Romanian'),
            ('English'),
            ('Hungarian'),
            ('German'),
            ('French'),
            ('Spanish');
        `);
        }

        const [universityRows] = await db.countOfAllUniversities();
        if (universityRows.count === 0) {
            await databaseConnection.executeQuery(`
            INSERT INTO university (university_name) VALUES
            ('UBB'),
            ('UT'),
            ('UMF'),
            ('Sapientia');
        `);
        }

    } catch (error) {
        console.error(`Error while creating the table: ${error}`);
        process.exit(1);
    }
};
