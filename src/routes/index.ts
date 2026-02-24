import express from 'express'
import dotenv from 'dotenv'
import type { Request, Response } from 'express'
import { GetAllData } from '../services/index.js';

const router = express.Router();

router.get("/data", async (req: Request, res: Response) => {
    try {
        const data = await GetAllData();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/", (req: Request, res: Response) => {
    res.send("👍");
})


export default router;