import express from "express";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "userTwo"] })
});

app.post('/register', (req, res) => {
    console.log(req.body);
    res.json({ success: true, message: 'Registration request received' });
});

/*
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});*/

app.listen(5000, () => { console.log("Server started on port 5000") })
