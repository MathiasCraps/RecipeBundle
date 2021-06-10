import { Pool } from 'pg';
import { QuantityLessIngredient } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

export async function getAllIngredients(pool: Pool): Promise<QuantityLessIngredient[]> {
    const results = await executeQuery(pool, {
        name: 'get-all-ingredients',
        text: `SELECT Ingredients.id as recipe_id, ingredient_name, Ingredients.ingredient_quantity_id, IngredientCategory.id as category_id, IngredientCategory.category_name
        FROM Ingredients 
        INNER JOIN IngredientCategory
        ON Ingredients.ingredient_category_id = IngredientCategory.id`,
        values: []
    });

    return results.rows.map((entry) => {
        return {
            id: entry.recipe_id,
            name: entry.ingredient_name,
            categoryId: entry.category_id,
            categoryName: entry.category_name,
            quantity_description_id: entry.ingredient_quantity_id
        }  as QuantityLessIngredient;
    });
}