import { pool } from '../../..';
import { DayMenu } from '../../../model/RecipeData';
import { modifyMenu } from '../../../sql/menu/UpdateMenu';

export async function writeMenuChangeToDatabase(userId: number | undefined, menu: DayMenu, type: 'add' | 'update' | 'remove'): Promise<number> {
    if (userId === undefined) {
        throw 'Not logged in';
    }

    try {
        return await modifyMenu(pool, menu, userId, type);                    
    } catch(err) {
        throw err;
    }
}