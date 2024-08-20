import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.get('/', async (req, res) => {
    try {

        const jobs = await db.selectJobs();

        if (jobs) {

            for (let job of jobs) {
                const companyName = await db.selectCompanyNameById(job.company_id);
                Object.assign(job, companyName);
            }

            return res.status(200).json(jobs);
        }

        return res.status(404).json({ message: 'No jobs' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/student/applicant/:jobId', async (req, res) => {
    try {

        const { jobId } = req.params;
        console.log(jobId);
        const applications = await db.selectAcceptedApplicantsByJobId(jobId);

        if (applications) {
            let result = [];

            for (let application of applications) {

                let userId = await db.selectUserIdByStudentId(application.student_id);
                const user = await db.selectUserById(userId.user_id);

                result.push(user[0]);
            }

            console.log(result);
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'No users' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.selectJobById(id);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.deleteApplicationByJobId(id);
        const result = await db.deleteJob(id);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/company/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const jobs = await db.selectJobsByCompanyId(id);

        if (jobs) {
            for (let job of jobs) {
                const companyName = await db.selectCompanyNameById(job.company_id);
                Object.assign(job, companyName);
            }

            return res.status(200).json(jobs);
        }

        return res.status(404).json({ message: 'No jobs' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/companyId/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.selectCompanyIdById(id);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

export default router;