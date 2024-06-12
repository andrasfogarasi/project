import connectToDatabase from './db.js';

export const insertUser = async (username, email, firstName, lastName, hashedPassword) => {
    const db = await connectToDatabase();
    const query = 'INSERT INTO users (username, email, first_name, last_name, password) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [username, email, firstName, lastName, hashedPassword]);
    return result;
};
