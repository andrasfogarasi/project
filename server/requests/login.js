import express from "express";

const router = express.Router();

router.post('/', async (req, res) => {
    try {

    } catch (err) {
        return res.status(500).render('error', { message: `500: Hiba tortent!: ${err.message}` });
    }
});

export default router;