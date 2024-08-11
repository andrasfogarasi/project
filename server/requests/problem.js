import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const failedRegistration = 'Adding new job failed';

router.get('/', async (req, res) => {
    try {

        const result = await db.selectProblems();
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

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

router.delete('/:problemId', async (req, res) => {
    try {
        const { problemId } = req.params;
        const problem = await db.selectProblemById(problemId);

        if (problem === undefined) {
            const errorMessage = 'Problem not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        await db.deleteProblem(problemId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

export default router;