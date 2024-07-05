import express from 'express';
import bcrypt from 'bcrypt';
import * as db from '../db/queries.js';

const router = express.Router();
const errorMessage = 'Login failed';

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
        const checkPassword = await bcrypt.compare(jelszo, passwordFromDb);

        if (!checkPassword) {
            const errorMessage = 'Wrong password!';
            return res.status(401).json({ message: failedRegistring, error: errorMessage });
        }
        // aut.createJWT(fid, felhSzerep);

        return res.status(200);

    } catch (err) {
        return res.status(500).render('error', { message: `500: Error: ${err.message}` });
    }
});

export default router;