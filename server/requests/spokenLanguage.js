import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.get('/:studentId', async (req, res) => {
    try {

        const { studentId } = req.params;

        const languages = await db.selectSpokenLanguageByStudentId(studentId);
        return res.status(200).json(languages);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

export default router;