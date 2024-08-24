import express from 'express';
import multer from 'multer';
import util from 'util';
import path from 'path';
import * as db from '../db/queries.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
router.use(express.json());

const internalServerError = 'Internal Server Error';
const failedInserting = 'Inserting failed!';

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('document');
const uploadAsync = util.promisify(upload);

function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: PDFs Only!');
    }
}

router.post('/', async (req, res) => {
    try {

        console.log(req.body);
        let { universityId, birthdayDate, universityCourse, presentation, userId } = req.body;

        const today = new Date();
        const birthDate = new Date(birthdayDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
        }

        if (age < 18) {
            const errorMessage = 'User is too young!';
            return res.status(409).json({ message: failedInserting, error: errorMessage });
        }

        const user = await db.selectUserById(userId);

        if (user === undefined) {
            const errorMessage = 'User not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        universityId = parseInt(universityId, 10);
        const result = await db.insertStudent(userId, universityId, birthdayDate, universityCourse, presentation);

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedInserting, error: error.message });
    }
});

router.post('/upload/:studentId', async (req, res) => {
    try {
        await uploadAsync(req, res);
        if (req.file === undefined) {
            return res.status(400).send('Error: No File Selected!');
        }

        const { studentId } = req.params;
        let fileName = req.file.filename;

        await db.updateStudentCV(req.file.filename, studentId);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.selectStudentById(userId);

        if (result.length > 0) {
            const student = result[0];

            let universityName = await db.selectUniversityeNameById(student.university_id);
            universityName = universityName[0];

            const response = { student: student, university: universityName };

            return res.status(200).json(response);
        } else {
            return res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

router.get('/download-cv/:fileName', (req, res) => {
    const { fileName } = req.params;
    console.log(fileName);
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error downloading the file', error: err.message });
        }
    });
});

router.get('/id/:companyId', async (req, res) => {
    const { companyId } = req.params;

    try {
        const result = await db.selectStudentIdByUserId(companyId);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
});

export default router;