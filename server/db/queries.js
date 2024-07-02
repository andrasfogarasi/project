import databaseConnection from './databaseConnection.js';

export const insertUser = async (username, email, firstName, lastName, hashedPassword, flag) => {
    const query = 'INSERT INTO user (username, email, first_name, last_name, password, flag) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await databaseConnection.executeQuery(query, [username, email, firstName, lastName, hashedPassword, flag]);
    return result;
};

export const selectUserIdByUsername = async (username) => {
    const query = 'SELECT id FROM user WHERE username LIKE ?';
    const [result] = await databaseConnection.executeQuery(query, [username]);
    return result;
};
