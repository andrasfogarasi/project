import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import login from "./requests/login";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/register', login);

app.post('/register', (req, res) => {
    console.log(req.body);
    res.json({ success: true, message: 'Registration request received' });
});

app.listen(5000, () => { console.log("Server started on port 5000") })
