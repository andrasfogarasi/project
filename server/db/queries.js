import databaseConnection from './databaseConnection.js';

export const insertUser = async (username, email, firstname, lastname, password, flag) => {
    const query = 'INSERT INTO user (username, email, first_name, last_name, password, flag) VALUES (?, ?, ?, ?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [username, email, firstname, lastname, password, flag]);
    return result;
};

export const insertCompany = async (companyName, email, password, flag) => {
    const query = 'INSERT INTO company (company_name, email, password, flag) VALUES (?, ?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [companyName, email, password, flag]);
    return result;
};

export const countOfAllDepartment = async () => {
    const query = 'SELECT COUNT(*) FROM department';
    const result = await databaseConnection.executeQuery(query);
    return result;
}

export const selectUserIdByEmail = async (email) => {
    const query = 'SELECT id FROM user WHERE email LIKE ?';
    const [result] = await databaseConnection.executeQuery(query, [email]);
    return result;
};

export const selectCompanyIdByEmail = async (email) => {
    const query = 'SELECT id FROM company WHERE email LIKE ?';
    const [result] = await databaseConnection.executeQuery(query, [email]);
    return result;
};

export const selectUserPasswordById = async (id) => {
    const query = 'SELECT password FROM user WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectCompanyPasswordById = async (id) => {
    const query = 'SELECT password FROM company WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectUserFlagById = async (id) => {
    const query = 'SELECT flag FROM user WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectCompanyFlagById = async (id) => {
    const query = 'SELECT flag FROM company WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectUsernameById = async (id) => {
    const query = 'SELECT username FROM user WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectCompanyNameById = async (id) => {
    const query = 'SELECT company_name FROM company WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectUserById = async (id) => {
    const query = 'SELECT * FROM user where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectJobs = async () => {
    const query = 'SELECT * FROM job';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const selectJobById = async (id) => {
    const query = 'SELECT * FROM job where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};