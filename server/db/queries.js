import databaseConnection from './databaseConnection.js';

export const insertUser = async (username, email, firstname, lastname, password, flag) => {
    const query = 'INSERT INTO user (username, email, first_name, last_name, password, flag) VALUES (?, ?, ?, ?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [username, email, firstname, lastname, password, flag]);
    return result;
};

export const insertStudent = async (userId, universityId, birthdayDate, universityCourse, presentation) => {
    const query = 'INSERT INTO student (user_id, university_id, birthday_date, university_course, presentation) VALUES (?, ?, ?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [userId, universityId, birthdayDate, universityCourse, presentation]);
    return result;
};

export const insertCompany = async (companyName, email, password, flag, telNumber, location) => {
    const query = 'INSERT INTO company (company_name, email, password, flag, tel_number, location) VALUES (?, ?, ?, ?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [companyName, email, password, flag, telNumber, location]);
    return result;
};

export const insertJob = async (name, description, requirements, salary, companyId, departmentId, workingHours, applicationLimit, workingType) => {
    const query = 'INSERT INTO job (name, description, requirements, salary, company_id, department_id, working_hours, application_limit, working_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [name, description, requirements, salary, companyId, departmentId, workingHours, applicationLimit, workingType]);
    return result;
};

export const insertApplication = async (studentId, jobId, message) => {
    const query = 'INSERT INTO application (student_id, job_id, message) VALUES (?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [studentId, jobId, message]);
    return result;
};

export const insertProblem = async (userId, description) => {
    const query = 'INSERT INTO problem (user_id, description) VALUES (?, ?)';
    const result = await databaseConnection.executeQuery(query, [userId, description]);
    return result;
};

export const insertSpokenLanguage = async (studentId, languageId, languageLevel) => {
    const query = 'INSERT INTO spoken_language (student_id, language_id, level) VALUES (?, ?, ?)';
    const result = await databaseConnection.executeQuery(query, [studentId, languageId, languageLevel]);
    return result;
};

export const insertDepartment = async (name) => {
    const query = 'INSERT INTO department (department_name) VALUES ( ?)';
    const result = await databaseConnection.executeQuery(query, [name]);
    return result;
};

export const countOfAllDepartments = async () => {
    const query = 'SELECT COUNT(*) as count FROM department';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const countOfAllUsers = async () => {
    const query = 'SELECT COUNT(*) as count FROM user';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const countOfAllLanguages = async () => {
    const query = 'SELECT COUNT(*) as count FROM language';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const countOfAllUniversities = async () => {
    const query = 'SELECT COUNT(*) as count FROM university';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const countOfAllAcceptedStudent = async (jobId) => {
    const query = 'SELECT COUNT(*) as count FROM application where job_id = ? and accept = true';
    const result = await databaseConnection.executeQuery(query, [jobId]);
    return result;
};

export const selectAllUsersExceptAdmin = async () => {
    const query = 'SELECT * FROM user WHERE flag > 1';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const selectCompanies = async () => {
    const query = 'SELECT * FROM company';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const selectWaitingCompanies = async () => {
    const query = 'SELECT * FROM company where waiting = TRUE';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const selectUserIdByEmail = async (email) => {
    const query = 'SELECT id FROM user WHERE email LIKE ?';
    const [result] = await databaseConnection.executeQuery(query, [email]);
    return result;
};

export const selectUserIdByStudentId = async (studentId) => {
    const query = 'SELECT user_id FROM student WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [studentId]);
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

export const selectBannedById = async (id) => {
    const query = 'SELECT banned FROM user WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectCompanyNameById = async (id) => {
    const query = 'SELECT company_name FROM company WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectCompanyBannedById = async (id) => {
    const query = 'SELECT banned FROM company WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectCompanyWaitingById = async (id) => {
    const query = 'SELECT waiting FROM company WHERE id = ?';
    const [result] = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectUserById = async (id) => {
    const query = 'SELECT * FROM user where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectUserIdAndUsernameById = async (id) => {
    const query = 'SELECT id, username FROM user where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectLanguageByLanguageId = async (languageId) => {
    const query = 'SELECT * FROM language where language_id = ?';
    const result = await databaseConnection.executeQuery(query, [languageId]);
    return result;
};

export const selectLanguageIdByLanguageName = async (languageName) => {
    const query = 'SELECT language_id FROM language where language_name LIKE ?';
    const result = await databaseConnection.executeQuery(query, [languageName]);
    return result;
};

export const selectSpokenLanguageByStudentId = async (studentId) => {
    const query = 'SELECT * FROM spoken_language join language ON language.language_id = spoken_language.student_id where student_id = ?';
    const result = await databaseConnection.executeQuery(query, [studentId]);
    return result;
};

export const selectStudentById = async (userId) => {
    const query = 'SELECT * FROM student where user_id = ?';
    const result = await databaseConnection.executeQuery(query, [userId]);
    return result;
};

export const selectStudentIdByUserId = async (userId) => {
    const query = 'SELECT id FROM student where user_id = ?';
    const result = await databaseConnection.executeQuery(query, [userId]);
    return result;
};

export const selectCompanyById = async (id) => {
    const query = 'SELECT * FROM company where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectProblemById = async (id) => {
    const query = 'SELECT * FROM problem where id = ?';
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
    const query = 'SELECT id, department_name FROM department where id = ?';
    const result = await databaseConnection.executeQuery(query, [departmentId]);
    return result;
};

export const selectDepartmentIdByName = async (departmentName) => {
    const query = 'SELECT id FROM department where department_name LIKE ?';
    const result = await databaseConnection.executeQuery(query, [departmentName]);
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

export const selectProblems = async () => {
    const query = 'SELECT * FROM problem';
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

export const selectUniversityIdByName = async (universityName) => {
    const query = 'SELECT id FROM university WHERE university_name LIKE ?';
    const result = await databaseConnection.executeQuery(query, [universityName]);
    return result;
};

export const selectJobs = async () => {
    const query = 'SELECT * FROM job';
    const result = await databaseConnection.executeQuery(query);
    return result;
};

export const selectActiveJobs = async () => {
    const query = 'SELECT * FROM job where active = TRUE';
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

export const selectCompanyIdById = async (id) => {
    const query = 'SELECT company_id FROM job where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const selectApplicantsByJobId = async (jobId) => {
    const query = 'SELECT * FROM application where job_id = ?';
    const result = await databaseConnection.executeQuery(query, [jobId]);
    return result;
};

export const selectAcceptedApplicantsByJobId = async (jobId) => {
    const query = 'SELECT * FROM application where job_id = ? and accept = TRUE';
    const result = await databaseConnection.executeQuery(query, [jobId]);
    return result;
};

export const selectRejectedApplicantsByJobId = async (jobId) => {
    const query = 'SELECT * FROM application where job_id = ? and accept = FALSE';
    const result = await databaseConnection.executeQuery(query, [jobId]);
    return result;
};

export const selectApplicationByJobAndStudentId = async (jobId, studentId) => {
    const query = 'SELECT * FROM application where job_id = ? and student_id = ?';
    const result = await databaseConnection.executeQuery(query, [jobId, studentId]);
    return result;
};

export const selectApplicationByStudentId = async (studentId) => {
    const query = 'SELECT * FROM application where student_id = ?';
    const result = await databaseConnection.executeQuery(query, [studentId]);
    return result;
};

export const selectApplicationIdByStudentIdAndJobId = async (studentId, jobId) => {
    const query = 'SELECT id FROM application where student_id = ? and job_id = ? ';
    const result = await databaseConnection.executeQuery(query, [studentId, jobId]);
    return result;
};

export const deleteJob = async (id) => {
    const query = 'DELETE FROM job where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const deleteJobByCompanyId = async (id) => {
    const query = 'DELETE FROM job where company_id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const deleteApplicationByJobId = async (id) => {
    const query = 'DELETE FROM application where job_id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const deleteUser = async (id) => {
    const query = 'DELETE FROM user where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const deleteCompany = async (id) => {
    const query = 'DELETE FROM company where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const deleteProblem = async (id) => {
    const query = 'DELETE FROM problem where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const deleteDepartment = async (id) => {
    const query = 'DELETE FROM department where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const deleteStudent = async (id) => {
    const query = 'DELETE FROM student where id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const deleteApplicationByStudentId = async (id) => {
    const query = 'DELETE FROM application where student_id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const updateApplicationAccept = async (applicationId, accept, response) => {
    const query = 'UPDATE application set accept = ?, response = ? WHERE id = ?';
    const result = await databaseConnection.executeQuery(query, [accept, response, applicationId]);
    return result;
};

export const updateBanToTrue = async (userId) => {
    const query = 'UPDATE user set banned = TRUE WHERE id = ?';
    const result = await databaseConnection.executeQuery(query, [userId]);
    return result;
};

export const updateCompanyBanToTrue = async (userId) => {
    const query = 'UPDATE company set banned = TRUE WHERE id = ?';
    const result = await databaseConnection.executeQuery(query, [userId]);
    return result;
};

export const updateBanToFalse = async (userId) => {
    const query = 'UPDATE user set banned = FALSE WHERE id = ?';
    const result = await databaseConnection.executeQuery(query, [userId]);
    return result;
};

export const updateCompanyBanToFalse = async (userId) => {
    const query = 'UPDATE company set banned = FALSE WHERE id = ?';
    const result = await databaseConnection.executeQuery(query, [userId]);
    return result;
};

export const updateCompanyWaitToFalse = async (userId) => {
    const query = 'UPDATE company set waiting = FALSE WHERE id = ?';
    const result = await databaseConnection.executeQuery(query, [userId]);
    return result;
};

export const updateJobActiveToFalse = async (id) => {
    const query = 'UPDATE job set active = FALSE WHERE id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const updateJobActiveToTrue = async (id) => {
    const query = 'UPDATE job set active = TRUE WHERE id = ?';
    const result = await databaseConnection.executeQuery(query, [id]);
    return result;
};

export const updateStudentCV = async (filename, studentId) => {
    const query = 'UPDATE student set cv_filename = ? WHERE id = ?';
    const result = await databaseConnection.executeQuery(query, [filename, studentId]);
    return result;
};