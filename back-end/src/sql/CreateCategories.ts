import { Pool } from 'pg';
import { Category } from '../model/RecipeData';
import { executeQuery } from '../sql-utils/Database';

export async function createCategories(pool: Pool, categories: Category[]): Promise<void> {
    for (const category of categories) {
        const categoryId = (await executeQuery(pool, {
            name: 'create-basic-category',
            text: 'INSERT INTO IngredientCategory (category_name) VALUES($1) RETURNING id',
            values: [category.categoryName]
        })).rows[0].id;

        const keys = Object.keys(category.translations);
        for(let key of keys) {
            await executeQuery(pool, {
                name: 'create-ingredients-localisation',
                text: 'INSERT INTO IngredientCategoryTranslation (category_id, language_code, localised_name) VALUES($1, $2, $3)',
                values: [categoryId, key.substr(0, 2), category.translations[key]]
            });    
        }
    }
}