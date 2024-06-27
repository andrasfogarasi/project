import databaseConnection from './databaseConnection';

export const insertUser = async (username, email, firstName, lastName, hashedPassword) => {
    const query = 'INSERT INTO users (username, email, first_name, last_name, password) VALUES (?, ?, ?, ?, ?)';
    const [result] = await databaseConnection.executeQuery(query, [username, email, firstName, lastName, hashedPassword]);
    return result;
};

export const selectUserByName = async (username) => {
    const query = 'SELECT  INTO users (username, email, first_name, last_name, password) VALUES (?, ?, ?, ?, ?)';
    const [result] = await databaseConnection.executeQuery(query, [username, email, firstName, lastName, hashedPassword]);
    return result;
};
