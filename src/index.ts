import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();
const app = express();
const port = process.env.port || 8005;

app.use(express.json());
app.use("/api", router);

app.listen(port, () => {
    console.log(`analytics_server is running on port:${port}`);
})