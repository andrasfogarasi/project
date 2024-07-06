import express from 'express';
import bcrypt from 'bcrypt';
import * as db from '../db/queries.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const errorMessage = 'Login failed';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 24 * 60 * 60 * 1000,
};

router.post('/', async (req, res) => {
    try {
        console.log(req.body);

        const { email, password } = req.body;

        // aut.deleteJWT();
        if (email === '' || password === '') {
            const errorMessage = 'Not enough data given!';
            return res.status(400).json({ message: failedRegistring, error: errorMessage });
        }

        const userId = await db.selectUserIdByEmail(email);

        if (userId === undefined) {
            const errorMessage = 'User does not exist!';
            return res.status(409).json({ message: failedRegistring, error: errorMessage });
        }

        const passwordFromDb = await db.selectPasswordById(userId);
        const checkPassword = await bcrypt.compare(password, passwordFromDb);

        if (!checkPassword) {
            const errorMessage = 'Wrong password!';
            return res.status(401).json({ message: failedRegistring, error: errorMessage });
        }

        const flag = await db.selectFlagById(userId);
        const token = jwt.sign({ userId, flag }, JWT_SECRET, { expiresIn: '1d' });

        res.cookie('authToken', token, cookieOptions);
        return res.status(200);

    } catch (error) {
        return res.status(500).json({ message: failedRegistring, error: error.message });
    }
});

export default router;