import express from 'express'
import type { Request, Response } from 'express'
import { GetAllData, getBrowserCount, getClickCountOfUrl, getTimeSeries, getUrlSummary, ipList } from '../repository/index.js';

const router = express.Router();

router.get("/health", (req: Request, res: Response) => {
    res.send("👍");
})

router.get("/data", async (req: Request, res: Response) => {
    try {
        const data = await GetAllData();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/click-count/:shortcode", async (req: Request<{ shortcode: string }>, res: Response) => {
    try {
        const { shortcode } = req.params;
        if (!shortcode) {
            return res.status(400).json({ error: "Shortcode is required" });
        }
        const data = await getClickCountOfUrl(shortcode);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})

router.get("/ipList", async (req: Request, res: Response) => {
    try {
        const data = await ipList();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})


router.get("/stats/:code/summary", async (req: Request<{ code: string }>, res: Response) => {
    try {
        const { code } = req.params;
        const data = await getUrlSummary(code);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})

//example --> GET /stats/xyz789/timeseries?range=7d&interval=hour  Last 7 days hourly
//example --> GET /stats/xyz789/timeseries?range=30d&interval=day  Last 30 days daily
router.get("/stats/:code/timeseries", async (req: Request<{ code: string }>, res: Response) => {
    try {
        const { code } = req.params;
        const { range = "7d", interval = "hour" } = req.query;

        const data = await getTimeSeries(
            code,
            range as string,
            interval as "hour" | "day" | "week"
        );

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);

router.get('/total-browser-click', async (req: Request, res: Response) => {
    try {
        const data = await getBrowserCount();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

export default router;