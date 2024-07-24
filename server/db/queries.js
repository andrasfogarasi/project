import databaseConnection from './databaseConnection.js';

export const insertUser = async (username, email, firstname, lastname, password, flag) => {
    const query = 'INSERT INTO user (username, email, first_name, last_name, password, flag) VALUES (?, ?, ?, ?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [username, email, firstname, lastname, password, flag]);
    return result;
};

export const insertStudent = async (userId, universityId, birthdayDate, motherTongueId, presentation) => {
    const query = 'INSERT INTO student (user_id, university_id, birthday_date, mother_tongue_id, presentation) VALUES (?, ?, ?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [userId, universityId, birthdayDate, motherTongueId, presentation]);
    return result;
}

export const insertCompany = async (companyName, email, password, flag, telNumber, location) => {
    const query = 'INSERT INTO company (company_name, email, password, flag, tel_number, location) VALUES (?, ?, ?, ?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [companyName, email, password, flag, telNumber, location]);
    return result;
};

export const insertJob = async (name, description, requirements, salary, companyId, departmentId, workingHours, applicationLimit) => {
    const query = 'INSERT INTO job (name, description, requirements, salary, company_id, department_id, working_hours, application_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [name, description, requirements, salary, companyId, departmentId, workingHours, applicationLimit]);
    return result;
}

export const countOfAllDepartments = async () => {
    const query = 'SELECT COUNT(*) as count FROM department';
    const result = await databaseConnection.executeQuery(query);
    return result;
}

export const countOfAllUsers = async () => {
    const query = 'SELECT COUNT(*) as count FROM user';
    const result = await databaseConnection.executeQuery(query);
    return result;
}

export const countOfAllLanguages = async () => {
    const query = 'SELECT COUNT(*) as count FROM language';
    const result = await databaseConnection.executeQuery(query);
    return result;
}

export const countOfAllUniversities = async () => {
    const query = 'SELECT COUNT(*) as count FROM university';
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

export const selectLanguageByLanguageId = async (languageId) => {
    const query = 'SELECT * FROM language where language_id = ?';
    const result = await databaseConnection.executeQuery(query, [languageId]);
    return result;
};

export const selectStudentById = async (userId) => {
    const query = 'SELECT * FROM student where user_id = ?';
    const result = await databaseConnection.executeQuery(query, [userId]);
    return result;
};

export const selectCompanyById = async (id) => {
    const query = 'SELECT * FROM company where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectDepartmentById = async (id) => {
    const query = 'SELECT * FROM department where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectDepartments = async () => {
    const query = 'SELECT id, department_name FROM department';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const selectDepartmentIdAndNameById = async (departmentId) => {
    const query = 'SELECT id, department_name FROM department where department_id = ?';
    const result = await databaseConnection.executeQuery(query, [departmentId]);
    return result;
};

export const selectUniversities = async () => {
    const query = 'SELECT id, university_name FROM university';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const selectLanguages = async () => {
    const query = 'SELECT language_id, language_name FROM language';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const selectLanguageNameByLanguageId = async (languageId) => {
    const query = 'SELECT language_name FROM language where language_id = ?';
    const result = await databaseConnection.executeQuery(query, [languageId]);
    return result;
};

export const selectUniversityeNameById = async (id) => {
    const query = 'SELECT university_name FROM university where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectJobs = async () => {
    const query = 'SELECT * FROM job';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const selectJobsByCompanyId = async (id) => {
    const query = 'SELECT * FROM job where company_id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectJobById = async (id) => {
    const query = 'SELECT * FROM job where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const deleteJob = async (id) => {
    const query = 'DELETE FROM job where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};