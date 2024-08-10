import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const failedRegistration = 'Adding new job failed';

router.post('/', async (req, res) => {
    try {

        console.log(req.body);
        let { userId, description } = req.body;
        console.log(userId);

        const user = await db.selectUserById(userId);
        if (user === undefined) {
            const errorMessage = 'User not found!';
            return res.status(409).json({ message: failedRegistration, error: errorMessage });
        }

        const result = await db.insertProblem(userId, description);
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedRegistration, error: error.message });
    }
});

export default router;