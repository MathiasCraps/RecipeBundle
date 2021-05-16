import { Pool } from 'pg';
import { executeQuery } from '../../sql-utils/Database';

export async function removeInventoryItem(pool: Pool, ingredientId: number, userId: number): Promise<void> {
    executeQuery(pool, {
        name: 'remove-inventory-item',
        text: `DELETE FROM Inventory WHERE ingredient_id = $1 AND user_id = $2`,
        values: [ingredientId, userId]
    });
}