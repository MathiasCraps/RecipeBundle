import { Pool } from 'pg';
import { InventoryItem } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

export async function getInventoryOfUser(pool: Pool, userId: number): Promise<InventoryItem[]> {
    const results = (await executeQuery(pool, {
        name: 'get-menus',
        text: `SELECT ingredient_id, quantity FROM Inventory WHERE user_id = $1`,
        values: [userId]
    })).rows;

    return results.map((result) => {
        return {
            ingredientId: result.ingredient_id,
            quantity: result.quantity
        }
    });
}