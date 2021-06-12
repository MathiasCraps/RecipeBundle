import { Pool } from 'pg';
import { InventoryItem } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

export async function getInventoryOfUser(pool: Pool, userId: number): Promise<InventoryItem[]> {  
    const results = (await executeQuery(pool, {
        name: 'get-inventory',
        text: `SELECT ingredient_id, quantity, desired_quantity, Ingredients.ingredient_quantity_id as ingredient_quantity_id FROM Inventory 
        INNER JOIN Ingredients
        ON Inventory.ingredient_id = Ingredients.ingredient_quantity_id
        WHERE user_id = $1`,
        values: [userId]
    })).rows;

    return results.map((result) => {
        return {
            ingredientId: result.ingredient_id,
            quantity: result.quantity,
            desiredQuantity: result.desired_quantity,
            quantity_description_id: result.ingredient_quantity_id 
        }
    });
}