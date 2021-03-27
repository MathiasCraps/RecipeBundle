import { Pool } from 'pg';
import { Category } from '../model/RecipeData';
import { executeQuery } from '../sql-utils/Database';

let cachedCategories: Category[] = [];
export async function getIngredientCategories(pool: Pool): Promise<Category[]> {
    if (!cachedCategories.length) {
        const categories = (await executeQuery(pool, {
            name: 'get-all-ingredients',
            text: 'SELECT * from IngredientCategory',
            values: []
        })).rows;
    
        cachedCategories = categories.map((category) => {
            return {
                categoryId: category.id,
                categoryName: category.category_name
            }
        })
    }
    return cachedCategories;
}