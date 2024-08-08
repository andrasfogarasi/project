import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';
const failedInserting = 'Inserting failed!'

router.post('/', async (req, res) => {
    try {

        console.log(req.body);
        let { universityId, birthdayDate, languageId, presentation, userId } = req.body;

        const today = new Date();
        const birthDate = new Date(birthdayDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
        }

        if (age < 18) {
            const errorMessage = 'User is too young!';
            return res.status(409).json({ message: failedInserting, error: errorMessage });
        }

        const user = await db.selectUserById(userId);

        if (user === undefined) {
            const errorMessage = 'User not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        languageId = parseInt(languageId, 10);
        const language = await db.selectLanguageByLanguageId(languageId);

        if (language === undefined) {
            const errorMessage = 'Language not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        universityId = parseInt(universityId, 10);
        const result = await db.insertStudent(userId, universityId, birthdayDate, languageId, presentation);

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedInserting, error: error.message });
    }
});

router.get('/:companyId', async (req, res) => {
    const { companyId } = req.params;

    try {
        const result = await db.selectStudentById(companyId);
        const student = result[0];

        let languageName = await db.selectLanguageNameByLanguageId(student.mother_tongue_id);
        languageName = languageName[0];

        let universityName = await db.selectUniversityeNameById(student.university_id);
        universityName = universityName[0];

        const response = { student: student, language: languageName, university: universityName };

        if (result) {
            return res.status(200).json(response);
        } else {
            return res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/id/:companyId', async (req, res) => {
    const { companyId } = req.params;

    try {
        const result = await db.selectStudentIdByUserId(companyId);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

export default router;