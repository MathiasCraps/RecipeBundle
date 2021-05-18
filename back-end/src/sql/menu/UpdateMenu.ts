import { Pool } from "pg";
import { DayMenu } from "../../model/RecipeData";
import { executeQuery } from "../../sql-utils/Database";

export async function modifyMenu(pool: Pool, menu: DayMenu, userId: number, action: 'add' | 'update' | 'remove'): Promise<number> {  
    try {  
        if (action === 'add') {
            const menuId = await executeQuery(pool, {
                name: 'add-menu',
                text: 'INSERT INTO MenuPlanning (user_id, recipe_id, planned_time) VALUES($1, $2, $3) RETURNING menu_id',
                values: [userId, menu.recipeId, menu.date]
            });
            return menuId.rows[0].menu_id;   
        } else if (action === 'remove') {
            await executeQuery(pool, {
                name: 'remove-menu',
                text: 'DELETE FROM MenuPlanning WHERE user_id = $1 AND menu_id = $2',
                values: [userId, menu.menuId]
            });
            return menu.menuId;
        } else if (action === 'update') {
            await executeQuery(pool, {
                name: 'update-user',
                text: 'UPDATE MenuPlanning SET planned_time = $1 WHERE menu_id = $2 AND user_id = $3',
                values: [menu.date, menu.menuId, userId]
            });
            return -1;
        }

        throw 'Not valid';
    } catch(err) {
        throw err;
    }
}