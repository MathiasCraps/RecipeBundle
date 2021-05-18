import { Pool } from "pg";
import { executeQuery } from "../../sql-utils/Database";

export async function getUser(pool: Pool, email: string): Promise<number | undefined> {
    try {
        const result = await executeQuery(pool, {
            name: 'get-user',
            text: 'SELECT id FROM Users WHERE email = $1',
            values: [email]
        });
    
        if (!result.rows.length) {
            return undefined;
        }
        return result.rows[0].id;
    } catch (err) {
        console.log(err);
        return undefined;
    }

}