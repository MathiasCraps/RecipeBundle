import { Pool } from 'pg';
import { InventoryItem } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

export async function getInventoryOfUser(pool: Pool, userId: number): Promise<InventoryItem[]> {
    const results = (await executeQuery(pool, {
        name: 'get-inventory',
        text: `SELECT ingredient_id, quantity, desired_quantity FROM Inventory WHERE user_id = $1`,
        values: [userId]
    })).rows;

    return results.map((result) => {
        return {
            ingredientId: result.ingredient_id,
            quantity: result.quantity,
            desiredQuantity: result.desired_quantity
        }
    });
}