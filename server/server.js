import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createTables } from './db/createTables.js';
import register from './requests/register.js';
import jobs from './requests/jobs.js';
import application from './requests/application.js';
import login from './requests/login.js';
import profile from './requests/profile.js';

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/register', register);
app.use('/jobs', jobs);
app.use('/application', application);
app.use('/login', login);
app.use('/profile', profile);

createTables().then(() => {
    app.listen(5000, () => {
        console.log(`Server listening on http://localhost:${port}/...`);
    });
});
