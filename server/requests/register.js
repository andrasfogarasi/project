import express from 'express';
import * as db from '../db/queries.js';
import { checkPassword } from '../checkings/ckeckPassword.js';
import bcrypt from 'bcrypt';
import { validateEmail } from '../checkings/validateEmail.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const router = express.Router();
router.use(express.json());
const failedRegistration = 'Registration failed';

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
        const { username, email, firstname, lastname, password, confirmPassword, flag } = req.body;

        res.clearCookie('authToken', cookieOptions);

        if (username === '' || email === '' || password === '' || confirmPassword === '') {
            const errorMessage = 'Not enough data given!';
            console.log(errorMessage);
            return res.status(400).json({ message: failedRegistration, error: errorMessage });
        }

        if (!validateEmail(email)) {
            const errorMessage = 'Wrong email format!';
            console.log(errorMessage);
            return res.status(409).json({ message: failedRegistration, error: errorMessage });
        }

        const userId = await db.selectUserIdByEmail(email);

        if (userId != undefined) {
            const errorMessage = 'User already existed in this email!';
            console.log(errorMessage);
            return res.status(409).json({ message: failedRegistration, error: errorMessage });
        }

        if (!checkPassword(password)) {
            const errorMessage = 'Password must contain uppercase letter, lowercase letter, number and longer than 7!';
            console.log(errorMessage);
            return res.status(409).json({ message: failedRegistration, error: errorMessage });
        }

        if (password != confirmPassword) {
            const errorMessage = 'Passwords does not match!';
            console.log(errorMessage);
            return res.status(409).json({ message: failedRegistration, error: errorMessage });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const result = await db.insertUser(username, email, firstname, lastname, encryptedPassword, flag);
        const uId = await db.selectUserIdByEmail(email);

        const token = jwt.sign({ id: uId, flag: flag.toString(), name: username }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('authToken', token, cookieOptions);
        return res.status(200).json({ token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedRegistration, error: error.message });
    }
});

export default router;