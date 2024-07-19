import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.get('/', async (req, res) => {
    try {

        const result = await db.selectJobs();
        return res.status(200).json(result);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.params);

    try {
        const result = await db.selectJobByCompanyId(id.id);
        console.log(result);
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