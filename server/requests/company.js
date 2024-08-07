import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.selectCompanyById(id);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/:id/name', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.selectCompanyNameById(id);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/:id/job/:jobId/applicants', async (req, res) => {
    const { id, jobId } = req.params;

    try {
        const applicants = await db.selectApplicantsByJobId(jobId);

        if (applicants) {
            let result = [];

            for (let applicant of applicants) {
                const userId = await db.selectUserIdByStudentId(applicant.student_id);

                const user = await db.selectUserById(userId);
                result.append(user);
            }

            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'No applicants' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

export default router;