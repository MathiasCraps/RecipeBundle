import { Pool } from 'pg';
import { InventoryItem } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

export async function updateInventoryItem(pool: Pool, inventoryItem: InventoryItem, userId: number): Promise<void> {
    executeQuery(pool, {
        name: 'update-inventory-item',
        text: `UPDATE Inventory SET quantity = $1, desired_quantity = $2 WHERE ingredient_id = $3 AND user_id = $4`,
        values: [inventoryItem.quantity, inventoryItem.desiredQuantity, inventoryItem.ingredientId,  userId]
    });
}