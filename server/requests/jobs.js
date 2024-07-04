import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    try {

        const result = await db.selectJobs();

        if (password != confirmPassword) {
            const errorMessage = 'User already existed!';
            console.log(errorMessage);
            return res.status(409).render('register', { error: `Error!: ${errorMessage}` });
        }

        return res.status(200);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: failedRegistring, error: error.message });
    }
});

export default router;