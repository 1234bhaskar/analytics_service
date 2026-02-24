import { createClient } from '@clickhouse/client'
import dotenv from "dotenv";


dotenv.config();

const client = createClient({
    url: process.env.CLICKHOUSE_URL || '',
    username: process.env.CLICKHOUSE_USER || '',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    max_open_connections: 10,
})

export default client;