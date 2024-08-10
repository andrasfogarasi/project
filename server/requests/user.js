import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const internalServerError = 'Internal Server Error';

router.get('/', async (req, res) => {
    try {

        const result = await db.selectAllUsersExceptAdmin();
        return res.status(200).json(result);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.delete('/:userId', async (req, res) => {
    try {

        const { userId } = req.params;
        const user = await db.selectUserById(userId);

        if (user === undefined) {
            const errorMessage = 'User not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        const student = await db.selectStudentIdByUserId(userId);

        if (student.length > 0) {
            const studentId = student[0].studentId;

            await db.deleteApplicationByStudentId(studentId);
            await db.deleteStudent(studentId);
        }

        await db.deleteUser(userId);
        res.status(200).json({ success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.post('/ban/:userId', async (req, res) => {
    try {

        const { userId } = req.params;
        const user = await db.selectUserById(userId);

        if (user === undefined) {
            const errorMessage = 'User not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        await db.updateBanToTrue(userId);
        res.status(200).json({ success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.post('/unblock/:userId', async (req, res) => {
    try {

        const { userId } = req.params;
        const user = await db.selectUserById(userId);

        if (user === undefined) {
            const errorMessage = 'User not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        await db.updateBanToFalse(userId);
        res.status(200).json({ success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

export default router;