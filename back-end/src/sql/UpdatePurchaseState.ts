import { Pool } from 'pg';
import { executeQuery } from '../sql-utils/Database';

export async function updatePurchaseState(pool: Pool, menuIds: number[], isPurchased: boolean, userId: number): Promise<boolean> {
    try {

        for (const menuId of menuIds) {
            await executeQuery(pool, {
                name: 'update-purchase-status',
                text: 'UPDATE MenuPlanning SET ingredients_purchased = $1 WHERE menu_id = $2 AND user_id = $3',
                values: [String(isPurchased), menuId, userId]
            });
        }
        return true;
    } catch (err) {
        return false;
    }
}