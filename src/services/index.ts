import client from "../db/index.db.js"

export async function GetAllData() {
    const resultSet = await client.query({
        query: 'SELECT * FROM `analytics-topic`',
        format: 'JSONEachRow',
    })
    const dataset = await resultSet.json()
    return dataset
}