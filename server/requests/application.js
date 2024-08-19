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

router.get('/:jobId/:studentId', async (req, res) => {
    try {

        const { jobId, studentId } = req.params;
        const result = await db.selectApplicationByJobAndStudentId(jobId, studentId);

        if (!result) {
            const errorMessage = 'Application not found!';
            return res.status(404).json({ error: errorMessage });
        }

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedInserting, error: error.message });
    }
});

router.get('/job/application/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {

        const applications = await db.selectApplicationByStudentId(studentId);

        if (applications) {
            let result = [];

            for (let application of applications) {
                let job = await db.selectJobById(application.job_id);
                job = job[0];

                if (job) {
                    const companyName = await db.selectCompanyNameById(job.company_id);
                    job.company_name = companyName;
                    Object.assign(job, companyName);
                }

                result.push(job);
            }

            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'No jobs' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedInserting, error: error.message });
    }
});

router.post('/response/:userId/job/:jobId', async (req, res) => {
    try {

        console.log(req.body);
        let { userId, jobId } = req.params;
        let { status, message } = req.body;

        const student = await db.selectStudentIdByUserId(userId);

        const studentId = student[0].id;

        const application = await db.selectApplicationIdByStudentIdAndJobId(studentId, jobId);
        let applicationId = application[0].id;

        if (status == 'rejected') {
            await db.updateApplicationAccept(applicationId, false, message);
        } else {
            const job = await db.selectJobById(jobId);
            const applicationLimit = job[0].application_limit;

            const countStudents = await db.countOfAllAcceptedStudent(jobId);
            const nrOfStudents = countStudents.count;

            console.log(applicationLimit);
            console.log(nrOfStudents);

            if (nrOfStudents < applicationLimit) {
                await db.updateApplicationAccept(applicationId, true, message);
            } else {
                await db.updateApplicationAccept(applicationId, false, message);
            }
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedInserting, error: error.message });
    }
});

export default router;