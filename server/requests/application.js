import express from 'express';
import * as db from '../db/queries.js';

const router = express.Router();
router.use(express.json());
const failedRegistring = 'Internal Server Error';

router.post('/', async (req, res) => {
    try {

        console.log(req.body);

        console.log("siker");
        return res.status(200);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: failedRegistring, error: error.message });
    }
});

export default router;