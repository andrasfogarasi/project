import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.post('/', async (req, res) => {
    try {

        console.log(req.body);
        const { universityId, birthdayDate, languageId, presentation, userId } = req.body;

        const today = new Date();
        const birthDate = new Date(birthdayDate);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
        }

        if (age < 18) {
            const errorMessage = 'User is too young!';
            return res.status(409).json({ message: failedRegistration, error: errorMessage });
        }

        const user = await db.selectUserById(userId);

        if (user === undefined) {
            const errorMessage = 'User not found!';
            return res.status(404).json({ message: failedRegistration, error: errorMessage });
        }

        languageId = parseInt(languageId, 10);
        const language = await db.selectLanguageByLanguageId(languageId);

        if (language === undefined) {
            const errorMessage = 'Language not found!';
            return res.status(404).json({ message: failedRegistration, error: errorMessage });
        }

        const result = await db.insertCompany(companyName, email, encryptedPassword, flag, telNumber, location);

        return res.status(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedRegistration, error: error.message });
    }
});

router.get('/:companyId', async (req, res) => {
    const { companyId } = req.params;

    try {
        const result = await db.selectStudentById(companyId);
        if (result) {
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