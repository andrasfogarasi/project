import express from "express";
import connectToDatabase from "./db/database_connection.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const conn = await connectToDatabase();

        res.send('Database connection established');

    } catch (err) {
        return res.status(500).render('error', { message: `500: Error: ${err.message}` });
    }
});

export default router;