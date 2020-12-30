import { PoolClient } from "pg";

export async function executeQuery(client: PoolClient, query: string): Promise<void> {
    try {
        await client.query('BEGIN');
        await client.query(query);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
}