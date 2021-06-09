import { Pool } from 'pg';
import { QuantityLessIngredient } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';
import { convertArrayToLinkedMapWithPredicate } from '../../utils/ArrayUtils';
import { getQuantityDescription } from './GetQuantityDescriptions';

export async function getAllIngredients(pool: Pool): Promise<QuantityLessIngredient[]> {
    const results = await executeQuery(pool, {
        name: 'get-all-ingredients',
        text: `SELECT Ingredients.id as recipe_id, ingredient_name, Ingredients.ingredient_quantity_id, IngredientCategory.id as category_id, IngredientCategory.category_name
        FROM Ingredients 
        INNER JOIN IngredientCategory
        ON Ingredients.ingredient_category_id = IngredientCategory.id`,
        values: []
    });

    const categories = await getQuantityDescription(pool);
    const categoryMap = convertArrayToLinkedMapWithPredicate(categories, (category) => {
        return String(category.quantityDescriptorId);
    });

    return results.rows.map((entry) => {
        return {
            id: entry.recipe_id,
            name: entry.ingredient_name,
            categoryId: entry.category_id,
            categoryName: entry.category_name,
            quantityDescription: categoryMap[entry.ingredient_quantity_id]
        }  as QuantityLessIngredient;
    });
}