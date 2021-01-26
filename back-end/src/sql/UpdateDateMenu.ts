import { Pool } from "pg";
import { executeQuery } from "../sql-utils/Database";

export async function updateDateMenu(pool: Pool, menuId: number, date: number, currentUser: number) {
    try {
        await executeQuery(pool, {
            name: 'update-user',
            text: 'UPDATE MenuPlanning SET planned_time = $1 WHERE menu_id = $2 AND user_id = $3',
            values: [date, menuId, currentUser]
        });
    } catch (err) {
        console.log('err', err);
    }
}