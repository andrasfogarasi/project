import databaseConnection from './databaseConnection.js';

export const insertUser = async (username, email, firstName, lastName, password, flag) => {
    const query = 'INSERT INTO user (username, email, first_name, last_name, password, flag) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await databaseConnection.executeQuery(query, [username, email, firstName, lastName, password, flag]);
    return result;
};

export const selectUserIdByEmail = async (email) => {
    const query = 'SELECT id FROM user WHERE email LIKE ?';
    const [result] = await databaseConnection.executeQuery(query, [email]);
    return result;
};
