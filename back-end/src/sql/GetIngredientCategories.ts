import { Pool } from 'pg';
import { Category } from '../model/RecipeData';
import { executeQuery } from '../sql-utils/Database';

export async function getIngredientCategories(pool: Pool): Promise<Category[]> {
    const categories = (await executeQuery(pool, {
        name: 'get-all-ingredients',
        text: 'SELECT * from IngredientCategory',
        values: []
    })).rows;

    return categories.map((category) => {
        return {
            categoryId: category.category_id,
            categoryName: category.category_name
        }
    })    
}