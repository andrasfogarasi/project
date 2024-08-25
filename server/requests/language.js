import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.get('/', async (req, res) => {
    try {

        const result = await db.selectLanguages();
        return res.status(200).json(result);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.post('/:studentId', async (req, res) => {
    try {

        const { studentId } = req.params;
        const { languageId } = req.body;
        await db.insertSpokenLanguage(studentId, languageId);

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedInserting, error: error.message });
    }
});

export default router;