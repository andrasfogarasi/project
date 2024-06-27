import express from 'express';
import * as db from '../db/queries'

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
        }*/

        const fid = await db.selectFelhasznaloID(felnev);
        // mar be volt olvasva
        if (fid != null) {
            console.log('regisztracios form: 409: Mar letezik ez a szemely!');
            const error = 'regisztracios form: 409: Mar letezik ez a szemely!';
            return res.status(409).render('register', { uzenet: `Hiba tortent!: ${error}` });
        }
        if (!pass.isPasswordStrong(jelszo)) {
            console.log('Regisztracios form: A jelszoban legyen kisbetu, nagybetu, szam is, minimum 8 karakteres legyen!');
            const error =
                '409: Regisztracios form: A jelszoban legyen kisbetu, nagybetu, szam is, minimum 8 karakteres legyen!';
            return res.status(409).render('register', { uzenet: `Hiba tortent!: ${error}` });
        }
        if (jelszo !== jelszo2) {
            console.log('Regisztracios form: A 2 jelszo nem egyezik meg!');
            const error = '409: Regisztracios form: A 2 jelszo nem egyezik meg!';
            return res.status(409).render('register', { uzenet: `Hiba tortent!: ${error}` });
        }
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
        return res.redirect('/tantargyak');

    } catch (err) {
        return res.status(500).render('error', { message: `500: Error: ${err.message}` });
    }
});

export default router;