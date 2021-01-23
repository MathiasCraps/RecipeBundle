import { Pool } from "pg";
import { DayMenu } from "../model/RecipeData";
import { executeQuery } from "../sql-utils/Database";

export async function modifyMenu(pool: Pool, menu: DayMenu, userId: number, action: 'add' | 'remove') {  
    try {  
        if (action === 'add') {
            await executeQuery(pool, {
                name: 'add-menu',
                text: 'INSERT INTO MenuPlanning (user_id, recipe_id, planned_time) VALUES($1, $2, $3)',
                values: [userId, menu.recipeId, menu.date]
            });    
        } else {
            await executeQuery(pool, {
                name: 'remove-menu',
                text: 'DELETE FROM MenuPlanning WHERE user_id = $1 AND recipe_id = $2 AND planned_time = $3',
                values: [userId, menu.recipeId, menu.date]
            }); 
        }
    } catch(err) {
        throw err;
    }
}