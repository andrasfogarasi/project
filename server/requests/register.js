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

        const { username, email, firstname, lastname, password, confirmPassword } = req.body;
        if (username === '' || email === '' || password === '' || confirmPassword === '') {
            const errorMessage = 'No enough data given!';
            res.status(409).json({ message: failedRegistring, error: errorMessage });
        }

        if (!validateEmail(email)) {
            const errorMessage = 'Wrong email format!';
            res.status(409).json({ message: failedRegistring, error: errorMessage });
        }

        const userEmail = await db.selectUserIdByEmail(username);

        if (userEmail != undefined) {
            const errorMessage = 'User already existed in this email!';
            res.status(409).json({ message: failedRegistring, error: errorMessage });
        }

        if (!checkPassword(password)) {
            const errorMessage = 'Password must contain uppercase letter, lowercase letter, number and longer than 7!';
            return res.status(409).render('register', { error: `Error!: ${errorMessage}` });
        }

        if (password != confirmPassword) {
            const errorMessage = 'User already existed!';
            return res.status(409).render('register', { error: `Error!: ${errorMessage}` });
        }

        console.log('Bonjour');

        const encryptedPassword = await bcrypt.hash(password, 10);
        const result = await db.insertUser(username, email, firstname, lastname, encryptedPassword, 3);

        return res.status(200);

        /*
    
    const encryptedPassWd = await bcrypt.hash(jelszo, 10);
    const ujAdat = {
        namef: csnev,
        namek: knev,
        emailCim: email,
        uname: felnev,
        pass: encryptedPassWd,
    };
    await db.felhasznaloLetrehozas(ujAdat);
    const mess = 'regisztracios form: 201: Sikeres regisztracio!';
    console.log(mess);
    // szerepet berakni a tokenbe (kezdetbe 3 - diak)
    const uid = await db.selectFelhasznaloID(felnev);
    aut.createJWT(uid, 3);
    return res.redirect('/tantargyak');*/

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: failedRegistring, error: error.message });
    }
});

export default router;