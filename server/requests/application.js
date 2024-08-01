import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const failedInserting = 'Insert failed';

router.post('/', async (req, res) => {
    try {

        console.log(req.body);

        let { studentId, message, jobId } = req.body;
        studentId = parseInt(studentId, 10);

        if (studentId == 0 || jobId == 0) {
            const errorMessage = 'Not enought data given!';
            return res.status(400).json({ message: failedInserting, error: errorMessage });
        }

        const job = await db.selectJobById(jobId);

        if (!job) {
            const errorMessage = 'Job not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        const result = await db.insertApplication(studentId, jobId, message);

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedInserting, error: error.message });
    }
});

export default router;