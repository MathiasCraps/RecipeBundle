import { PoolClient, QueryConfig, QueryResult } from "pg";

export async function executeQuery(client: PoolClient, query: string | QueryConfig): Promise<QueryResult> {
    try {
        await client.query('BEGIN');
        const result = await client.query(query);
        await client.query('COMMIT');

        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
}