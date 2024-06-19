import database_connection from './database_connection';

export const createTable = async () => {
    try {
        await database_connection.executeQuery(`
    CREATE TABLE IF NOT EXISTS company (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(50),
        location VARCHAR(60) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        rating INT DEFAULT 0        -- lenne egy ful, ahol lehet ertekelni a ceget
    );
    `);

        await database_connection.executeQuery(`
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
    `);

        await database_connection.executeQuery(`
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
        `);

        await database_connection.executeQuery(`
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
            `);


    } catch (err) {
        console.error(`Hiba a tablak letrehozasanal!: ${err}`);
        process.exit(1);
    }
};