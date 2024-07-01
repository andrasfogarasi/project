import databaseConnection from './databaseConnection.js';

export const insertUser = async (username, email, firstName, lastName, hashedPassword, flag) => {
    const query = 'INSERT INTO users (username, email, first_name, last_name, password) VALUES (?, ?, ?, ?, ?)';
    const [result] = await databaseConnection.executeQuery(query, [username, email, firstName, lastName, hashedPassword]);
    return result;
};

export const selectUserIdByUsername = async (username) => {
    const query = 'SELECT id FROM users WHERE username LIKE ?';
    const [result] = await databaseConnection.executeQuery(query, [username]);
    return result;
};
