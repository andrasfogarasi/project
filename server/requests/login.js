import express from 'express';
import bcrypt from 'bcrypt';
import * as db from '../db/queries.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const router = express.Router();
const failedLogin = 'Login failed';

dotenv.config();
const JWT_SECRET = process.env.JWT_TOKEN;

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

        // delete cookie
        if (email === '' || password === '') {
            const errorMessage = 'Not enough data given!';
            return res.status(400).json({ message: failedLogin, error: errorMessage });
        }

        const userId = await db.selectUserIdByEmail(email);
        console.log(userId);

        if (userId === undefined) {
            const errorMessage = 'User does not exist!';
            return res.status(409).json({ message: failedLogin, error: errorMessage });
        }

        const passwordFromDb = await db.selectPasswordById(userId.id);
        const checkPassword = await bcrypt.compare(password, passwordFromDb.password);

        if (!checkPassword) {
            const errorMessage = 'Wrong password!';
            return res.status(401).json({ message: failedLogin, error: errorMessage });
        }

        const flag = await db.selectFlagById(userId.id);
        const username = await db.selectUsernameById(userId.id);
        const token = jwt.sign({ id: userId, flag: flag, name: username }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('authToken', token, cookieOptions);
        return res.status(200).json({ token });

    } catch (error) {
        return res.status(500).json({ message: failedLogin, error: error.message });
    }
});

export default router;