import express from 'express';
import * as db from '../db/queries.js';
import { checkPassword } from '../checkings/ckeckPassword.js';
import bcrypt from 'bcrypt';

const router = express.Router();
router.use(express.json());

router.post('/', async (req, res) => {
    try {
        console.log(req.body);

        const { username, email, firstname, lastname, passwd, confirm_passwd } = req.body;
        /*if (username === '' || firstname === '' || email === '' || lastname === '' || passwd === undefined || jelszo === undefined) {
            console.log('Regisztracios form: 400: Ures adatot adtal meg!');
            const error = 'Regisztracios form: 400: Ures adatot adtal meg!';
            return res.status(400).render('register', { uzenet: `Hiba tortent!: ${error}` });
        }

        const userId = db.selectUserIdByUsername(username); //email alapjan is lehet
        console.log(userId);

        if (userId != null) {
            const errorMessage = 'User already existed!';
            console.log(errorMessage);
            return res.status(409).render('register', { error: `Error!: ${errorMessage}` });
        }*/

        console.log('bonjour');
        /*

        if (!checkPassword(passwd)) {
            const errorMessage = 'Password must contain uppercase letter, lowercase letter, number and longer than 7!';
            console.log(errorMessage);
            return res.status(409).render('register', { error: `Error!: ${errorMessage}` });
        }

        console.log('bonjour');

        if (passwd != confirm_passwd) {
            const errorMessage = 'User already existed!';
            console.log(errorMessage);
            return res.status(409).render('register', { error: `Error!: ${errorMessage}` });
        }*/

        console.log('bonjour');

        const encryptedPassword = await bcrypt.hash(passwd, 10);
        db.insertUser(username, email, firstname, lastname, encryptedPassword, 2);

        return res.status(200);

        /*

    const fid = await db.selectFelhasznaloID(felnev);

    
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

    } catch (err) {
        return res.status(500).render('error', { error: `500: Error: ${err.message}` });
    }
});

export default router;