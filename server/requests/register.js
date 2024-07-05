import express from 'express';
import * as db from '../db/queries.js';
import { checkPassword } from '../checkings/ckeckPassword.js';
import bcrypt from 'bcrypt';
import { validateEmail } from '../checkings/validateEmail.js';

const router = express.Router();
router.use(express.json());
const failedRegistring = 'Registration failed';

router.post('/', async (req, res) => {
    try {

        console.log(req.body);
        const { username, email, firstname, lastname, password, confirmPassword, flag } = req.body;
        if (username === '' || email === '' || password === '' || confirmPassword === '') {
            const errorMessage = 'Not enough data given!';
            console.log(errorMessage);
            return res.status(400).json({ message: failedRegistring, error: errorMessage });
        }

        if (!validateEmail(email)) {
            const errorMessage = 'Wrong email format!';
            console.log(errorMessage);
            return res.status(409).json({ message: failedRegistring, error: errorMessage });
        }

        const userId = await db.selectUserIdByEmail(email);
        console.log(userId);

        if (userId != undefined) {
            const errorMessage = 'User already existed in this email!';
            console.log(errorMessage);
            return res.status(409).json({ message: failedRegistring, error: errorMessage });
        }

        if (!checkPassword(password)) {
            const errorMessage = 'Password must contain uppercase letter, lowercase letter, number and longer than 7!';
            console.log(errorMessage);
            return res.status(409).render('register', { error: `Error!: ${errorMessage}` });
        }

        if (password != confirmPassword) {
            const errorMessage = 'User already existed!';
            console.log(errorMessage);
            return res.status(409).render('register', { error: `Error!: ${errorMessage}` });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const result = await db.insertUser(username, email, firstname, lastname, encryptedPassword, flag);

        console.log("siker");
        return res.status(200);

        /*

    const uid = await db.selectFelhasznaloID(felnev);
    aut.createJWT(uid, 3);*/

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: failedRegistring, error: error.message });
    }
});

export default router;