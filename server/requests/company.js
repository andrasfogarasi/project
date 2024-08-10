import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.get('/', async (req, res) => {
    try {

        const result = await db.selectCompanies();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/:companyId', async (req, res) => {
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

router.delete('/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await db.selectCompanyById(companyId);

        if (company === undefined) {
            const errorMessage = 'Company not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
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

export default router;