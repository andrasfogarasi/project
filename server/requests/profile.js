import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.get('/:id', async (req, res) => {
    try {

        const { id } = req.params;
        const result = await db.selectUserById(id);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/company/:companyId', async (req, res) => {

    try {
        const { companyId } = req.params;
        const result = await db.selectCompanyById(companyId);

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

export default router;