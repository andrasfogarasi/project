import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.get('/', async (req, res) => {
    try {

        const result = await db.selectDepartments();
        return res.status(200).json(result);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.selectDepartmentIdAndNameById(id);

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

router.delete('/:departmentId', async (req, res) => {
    try {
        const { departmentId } = req.params;
        const department = await db.selectDepartmentById(departmentId);

        if (department === undefined) {
            const errorMessage = 'Department not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        await db.deleteDepartment(departmentId);

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

export default router;