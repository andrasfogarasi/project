import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createTables } from './db/createTables.js';
import register from './requests/register.js';
import job from './requests/job.js';
import application from './requests/application.js';
import login from './requests/login.js';
import profile from './requests/profile.js';
import RegisterCompany from './requests/registerCompany.js';
import department from './requests/department.js';
import createNewJob from './requests/createNewJob.js';
import university from './requests/university.js';
import language from './requests/language.js';
import student from './requests/student.js';
import company from './requests/company.js';
import applicant from './requests/applicant.js';
import problem from './requests/problem.js';
import user from './requests/user.js';
import createNewDepartment from './requests/createNewDepartment.js';
import spokenLanguage from './requests/spokenLanguage.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: process.env.API_URL,
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.API_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/register', register);
app.use('/job', job);
app.use('/application', application);
app.use('/login', login);
app.use('/profile', profile);
app.use('/registerCompany', RegisterCompany);
app.use('/department', department);
app.use('/createNewJob', createNewJob);
app.use('/university', university);
app.use('/language', language);
app.use('/student', student);
app.use('/company', company);
app.use('/applicant', applicant);
app.use('/problem', problem);
app.use('/user', user);
app.use('/createNewDepartment', createNewDepartment);
app.use('/spoken_language', spokenLanguage);

createTables().then(() => {
    app.listen(5000, () => {
        console.log(`Server listening on http://localhost:${port}/...`);
    });
});
