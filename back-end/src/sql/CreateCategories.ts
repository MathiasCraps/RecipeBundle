import { Pool } from 'pg';
import { executeQuery } from '../sql-utils/Database';

export async function createCategories(pool: Pool, categories: string[]): Promise<void> {
    for (const category of categories) {
        await executeQuery(pool, {
            name: 'get-ingredients-recipe',
            text: 'INSERT INTO IngredientCategory (category_name) VALUES($1)',
            values: [category]
        });
    }
}