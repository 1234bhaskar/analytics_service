import client from "../db/index.db.js"

export async function GetAllData() {
    const resultSet = await client.query({
        query: 'SELECT * FROM `analytics-topic`',
        format: 'JSONEachRow',
    })
    const dataset = await resultSet.json()
    return dataset
}

export async function getClickCountOfUrl(shortCode: string) {
    const resultSet = await client.query({
        query: `
            SELECT COUNT() AS total_clicks
            FROM \`analytics-topic\`
            WHERE short_code = {shortcode:String}
        `,
        format: 'JSONEachRow',
        query_params: {
            shortcode: shortCode,
        },
    })
    const dataset = await resultSet.json()
    return dataset;
}


export async function ipList() {
    const resultSet = await client.query({
        query: 'SELECT COUNT(DISTINCT ipv4) AS unique_ips FROM `analytics-topic`',
        format: 'JSONEachRow',
    })
    const dataset = await resultSet.json()
    return dataset
}

export async function getUrlSummary(code: string) {
    const resultSet = await client.query({
        query: `
            SELECT
                COUNT() AS total_clicks,
                COUNT(DISTINCT ipv4) AS unique_visitors,
                MAX(timestamp) AS last_click_time
            FROM \`analytics-topic\`
            WHERE short_code = {code:String}
        `,
        format: 'JSONEachRow',
        query_params: { code },
    });
    const dataset = await resultSet.json()
    return dataset;
}


type IntervalType = "hour" | "day" | "week";

const intervalMap = {
    hour: {
        fn: "toStartOfHour",
        step: "INTERVAL 1 HOUR",
    },
    day: {
        fn: "toStartOfDay",
        step: "INTERVAL 1 DAY",
    },
    week: {
        fn: "toStartOfWeek",
        step: "INTERVAL 1 WEEK",
    },
};

const rangeMap: Record<string, string> = {
    "24h": "INTERVAL 24 HOUR",
    "7d": "INTERVAL 7 DAY",
    "30d": "INTERVAL 30 DAY",
    "90d": "INTERVAL 90 DAY",
};

export async function getTimeSeries(
    code: string,
    range: string = "7d",
    interval: IntervalType = "hour"
) {
    const selectedRange = rangeMap[range] || rangeMap["7d"];
    const selectedInterval = intervalMap[interval] || intervalMap["hour"];

    const query = `
    SELECT 
        ${selectedInterval.fn}(timestamp) AS period,
        count() AS clicks,
        uniq(ipv4) AS unique_visitors
    FROM \`analytics-topic\`
    WHERE short_code = {code:String}
      AND timestamp >= now() - ${selectedRange}
    GROUP BY period
    ORDER BY period
    WITH FILL
      FROM ${selectedInterval.fn}(now() - ${selectedRange})
      TO ${selectedInterval.fn}(now())
      STEP ${selectedInterval.step}
  `;

    const resultSet = await client.query({
        query,
        format: "JSONEachRow",
        query_params: { code },
    });

    const data = await resultSet.json();

    return data.map((row: any) => ({
        period: row.period,
        clicks: Number(row.clicks || 0),
        unique_visitors: Number(row.unique_visitors || 0),
    }));
}

export async function getBrowserCount() {
    const resultSet = await client.query({
        query: `SELECT browser, count() AS total_clicks
                FROM \`analytics-topic\`
                GROUP BY browser
                ORDER BY total_clicks DESC`,
        format: 'JSONEachRow'
    })
    const dataset = await resultSet.json()
    return dataset
}

