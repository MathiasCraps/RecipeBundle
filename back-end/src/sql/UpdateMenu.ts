import { Pool } from "pg";
import { DayMenu } from "../model/RecipeData";
import { executeQuery } from "../sql-utils/Database";

export async function addMenu(pool: Pool, menu: DayMenu, userId: number) {  
    try {
        const results = await executeQuery(pool, {
            name: 'get-recipe-id',
            text: 'SELECT id FROM recipes WHERE recipe_name = $1',
            values: [menu.recipe.title]
        });
    
        const recipeId = results.rows[0].id;
    
        await executeQuery(pool, {
            name: 'add-menu',
            text: 'INSERT INTO MenuPlanning (user_id, recipe_id, planned_time) VALUES($1, $2, $3)',
            values: [userId, recipeId, menu.date]
        });
    } catch(err) {
        throw err;
    }
}