import { Pool, QueryConfig, QueryResult } from "pg";

export async function executeQuery(pool: Pool, query: string | QueryConfig): Promise<QueryResult> {
    try {
        await pool.query('BEGIN');
        const result = await pool.query(query);
        await pool.query('COMMIT');

        return result;
    } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
    }
}