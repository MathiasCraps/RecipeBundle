import { Pool } from "pg";
import { executeQuery } from "../../sql-utils/Database";

export async function createUser(pool: Pool, name: string, email: string): Promise<number> {
    const result = await executeQuery(pool, {
        name: 'add-user',
        text: 'INSERT INTO Users (name, email) VALUES($1, $2) returning id;',
        values: [name, email]
    });

    if (!result.rows.length) {
        throw new Error('Creating user failed.');
    }

    return result.rows[0].id;
} 