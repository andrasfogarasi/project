import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.get('/job/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
        const applicants = await db.selectApplicantsByJobId(jobId);

        if (applicants) {
            let data = [];

            for (let applicant of applicants) {
                let userId = await db.selectUserIdByStudentId(applicant.student_id);
                userId = userId.user_id;

                const user = await db.selectUserIdAndUsernameById(userId);

                if (applicant.accept === null) {
                    data.push({
                        id: userId,
                        username: user[0].username,
                        message: applicant.message // Feltételezve, hogy applicant objektumnak van 'message' mezője
                    });
                }
            }

            console.log(data);

            return res.status(200).json(data);
        } else {
            return res.status(404).json({ message: 'No applicants' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

export default router;