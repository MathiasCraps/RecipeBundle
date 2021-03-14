import { pool } from '..';
import { DayMenu } from '../model/RecipeData';
import { executeQuery } from '../sql-utils/Database';

export async function getMenus(userId: number | undefined): Promise<DayMenu[]> {
    if (userId === undefined) {
        return [];
    }

    const menus: DayMenu[] = [];
    const recipeIds = (await executeQuery(pool, 'SELECT id FROM Recipes')).rows;

    for (const identifier of recipeIds) {
        const recipeId = identifier.id;
        const menusFromDatabase = (await executeQuery(pool, {
            name: 'get-menus',
            text: `SELECT planned_time, menu_id FROM MenuPlanning WHERE recipe_id = $1 AND user_id = $2`,
            values: [recipeId, userId]
        })).rows;
    
        menus.push(...menusFromDatabase.map((menu: any) => {
            return {
                menuId: menu.menu_id,
                recipeId,
                date: Number(menu.planned_time),
                ingredientsBought: false // todo: add and link in database
            };
        }));
    }

    return menus;
}