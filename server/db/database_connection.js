import mysql2 from 'mysql2/promise';
import autoBind from 'auto-bind';
import dotenv from 'dotenv';

dotenv.config();

class DbConnection {
    constructor() {
        this.pool = mysql2.createPool({
            connectionLimit: 4,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        autoBind(this);
    }

    async executeQuery(query, options = []) {
        try {
            const [results] = await this.pool.query(query, options);
            return results;
        } catch (error) {
            throw new Error(`Error while running '${query}': ${error.message}`);
        }
    }

    async getConnection() {
        if (!this.connection) {
            this.connection = await this.pool.getConnection();
            console.log('Connected to the database.');
        }
        return this.connection;
    }
}

export default new DbConnection();
