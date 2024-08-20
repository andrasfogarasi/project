import express from 'express';
import multer from 'multer';
import PDFParser from 'pdf2json';
import path from 'path';
import * as db from '../db/queries.js';

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
}).single('documentUpload');

function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /pdf/;
    // Check file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check MIME type
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
        let { universityId, birthdayDate, languageId, presentation, userId } = req.body;

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

        languageId = parseInt(languageId, 10);
        const language = await db.selectLanguageByLanguageId(languageId);

        if (language === undefined) {
            const errorMessage = 'Language not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        universityId = parseInt(universityId, 10);
        const result = await db.insertStudent(userId, universityId, birthdayDate, languageId, presentation);

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: failedInserting, error: error.message });
    }
});

/*
const extractDataFromPDF = (pdfBuffer) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', errData => {
            console.error('PDF Parser data error:', errData);
            reject(errData.parserError);
        });
        pdfParser.on('pdfParser_dataReady', pdfData => {
            console.log('PDF Data:', pdfData);

            if (!pdfData || !pdfData.Pages) {
                return reject(new Error('Unexpected PDF data structure'));
            }

            let text = pdfData.Pages.map(page =>
                page.Texts.map(textItem =>
                    decodeURIComponent(textItem.R.map(r => r.T).join(''))
                ).join(' ')
            ).join('\n');

            const birthDateMatch = text.match(/Birth Date:\s*(\d{2}\/\d{2}\/\d{4})/);
            const languageMatch = text.match(/Language:\s*(\w+)/);
            const presentationMatch = text.match(/Presentation:\s*([\w\s\d]+)/);
            const universityMatch = text.match(/University:\s*(\w+)/);

            const extractedData = {
                birthDate: birthDateMatch ? birthDateMatch[1] : null,
                language: languageMatch ? languageMatch[1] : null,
                presentation: presentationMatch ? presentationMatch[1] : null,
                university: universityMatch ? universityMatch[1] : null,
            };

            resolve(extractedData);
        });

        pdfParser.parseBuffer(pdfBuffer);
    });
};*/

router.post('/upload/:userId', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            if (req.file == undefined) {
                res.status(400).send('Error: No File Selected!');
            } else {
                res.send(`File Uploaded: ${req.file.filename}`);
            }
        }
    });
});

/*
router.post('/uploadFile/:userId', upload.single('file'), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { userId } = req.params;

        const extractedData = await extractDataFromPDF(req.file.buffer);
        console.log(extractedData);

        let { birthDate, language, presentation, university } = extractedData;

        const today = new Date();
        const birthDayDate = new Date(birthDate);
        let age = today.getFullYear() - birthDayDate.getFullYear();
        const monthDiff = today.getMonth() - birthDayDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDayDate.getDate())) {
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

        const languageResult = await db.selectLanguageIdByLanguageName(language);

        if (languageResult.length == 0) {
            const errorMessage = 'Language not found!';
            return res.status(404).json({ message: failedInserting, error: errorMessage });
        }

        const languageId = languageResult[0].language_id;
        let universityId = await db.selectUniversityIdByName(university);
        universityId = universityId[0].id;

        const result = await db.insertStudent(userId, universityId, birthDayDate, languageId, presentation);

        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ success: false, message: 'Error processing PDF' });
    }
});*/

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.selectStudentById(userId);

        if (result.length > 0) {
            const student = result[0];

            let languageName = await db.selectLanguageNameByLanguageId(student.mother_tongue_id);
            languageName = languageName[0];

            let universityName = await db.selectUniversityeNameById(student.university_id);
            universityName = universityName[0];

            const response = { student: student, language: languageName, university: universityName };

            return res.status(200).json(response);
        } else {
            return res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: internalServerError, error: error.message });
    }
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