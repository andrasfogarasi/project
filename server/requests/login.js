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
        res.clearCookie('authToken', cookieOptions);

        if (email === '' || password === '') {
            const errorMessage = 'Not enough data given!';
            return res.status(400).json({ message: failedLogin, error: errorMessage });
        }

        const userId = await db.selectUserIdByEmail(email);

        const companyId = await db.selectCompanyIdByEmail(email);
        console.log(companyId);

        if (userId !== undefined) {
            const passwordFromDb = await db.selectUserPasswordById(userId.id);
            const checkPassword = await bcrypt.compare(password, passwordFromDb.password);

            if (!checkPassword) {
                const errorMessage = 'Wrong password!';
                return res.status(401).json({ message: failedLogin, error: errorMessage });
            }

            const flag = await db.selectUserFlagById(userId.id);
            const username = await db.selectUsernameById(userId.id);
            const banned = await db.selectBannedById(userId.id);

            const token = jwt.sign({ id: userId, flag: flag.flag, banned: banned.banned, name: username.username }, JWT_SECRET, { expiresIn: '1h' });

            res.cookie('authToken', token, cookieOptions);
            return res.status(200).json({ token });

        } else if (companyId !== undefined) {

            const passwordFromDb = await db.selectCompanyPasswordById(companyId.id);
            const checkPassword = await bcrypt.compare(password, passwordFromDb.password);

            if (!checkPassword) {
                const errorMessage = 'Wrong password!';
                return res.status(401).json({ message: failedLogin, error: errorMessage });
            }

            const flag = await db.selectCompanyFlagById(companyId.id);
            const companyName = await db.selectCompanyNameById(companyId.id);
            const banned = await db.selectCompanyBannedById(companyId.id);

            const token = jwt.sign({ companyId: companyId, flag: flag.flag, banned: banned.banned, companyName: companyName.company_name }, JWT_SECRET, { expiresIn: '1h' });

            res.cookie('authToken', token, cookieOptions);
            return res.status(200).json({ token });
        }

        const errorMessage = 'User does not exist!';
        return res.status(409).json({ message: failedLogin, error: errorMessage });

    } catch (error) {
        return res.status(500).json({ message: failedLogin, error: error.message });
    }
});

export default router;