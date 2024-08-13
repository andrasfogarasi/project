import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const failedRegistration = 'Adding new department failed';

router.post('/', async (req, res) => {
    try {

        console.log(req.body);
        let { name } = req.body;

        if (name === '') {
            const errorMessage = 'Not enough data given!';
            return res.status(400).json({ message: failedRegistration, error: errorMessage });
        }

        const department = await db.selectDepartmentIdByName(name);
        if (department.length > 0) {
            const errorMessage = 'Department already exists!';
            return res.status(409).json({ message: failedRegistration, error: errorMessage });
        }

        const result = await db.insertDepartment(name);
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedRegistration, error: error.message });
    }
});

export default router;