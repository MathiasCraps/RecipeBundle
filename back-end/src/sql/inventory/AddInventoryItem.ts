import { Pool } from 'pg';
import { InventoryItem } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

export async function addInventoryItem(pool: Pool, inventory: InventoryItem, userId: number): Promise<void> {
    executeQuery(pool, {
        name: 'add-inventory-item',
        text: `INSERT INTO Inventory (ingredient_id, user_id, quantity, desired_quantity) VALUES ($1, $2, $3, $4)`,
        values: [inventory.ingredientId, userId, inventory.quantity, inventory.desiredQuantity]
    });
}