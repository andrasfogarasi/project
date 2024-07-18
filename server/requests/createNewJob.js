import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const failedRegistration = 'Adding new job failed';

router.post('/', async (req, res) => {
    try {

        console.log(req.body);
        let { name, description, requirements, salary, workingHours, applicationLimit, departmentId, companyId } = req.body;
        salary = parseInt(salary, 10);
        workingHours = parseInt(workingHours, 10);
        applicationLimit = parseInt(applicationLimit, 10);
        departmentId = parseInt(departmentId, 10);
        companyId = companyId.id;

        if (name === '' || salary === 0 || workingHours === 0 || applicationLimit === 0 || departmentId === 0 || companyId === 0) {
            console.log("Hell");
            const errorMessage = 'Not enough data given!';
            return res.status(400).json({ message: failedRegistration, error: errorMessage });
        }

        const user = await db.selectCompanyById(companyId);


        if (user === undefined) {
            const errorMessage = 'User not found!';
            return res.status(409).json({ message: failedRegistration, error: errorMessage });
        }

        const department = await db.selectDepartmentById(departmentId);
        if (department === undefined) {
            const errorMessage = 'Department not found!';
            return res.status(409).json({ message: failedRegistration, error: errorMessage });
        }

        const result = await db.insertJob(name, description, requirements, salary, companyId, departmentId, workingHours, applicationLimit);
        return res.status(200);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedRegistration, error: error.message });
    }
});

export default router;