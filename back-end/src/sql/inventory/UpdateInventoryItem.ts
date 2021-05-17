import { Pool } from 'pg';
import { executeQuery } from '../../sql-utils/Database';

export async function updateInventoryItem(pool: Pool, ingredientId: number, userId: number, quantity: number): Promise<void> {
    executeQuery(pool, {
        name: 'update-inventory-item',
        text: `UPDATE Inventory SET quantity = $1 WHERE ingredient_id = $2 AND user_id = $3`,
        values: [quantity, ingredientId, userId]
    });
}