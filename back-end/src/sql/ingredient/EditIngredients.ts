import { Pool } from 'pg';
import { Ingredient } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

export async function updateIngredients(pool: Pool, ingredients: Ingredient[], recipeId: number): Promise<void> {
    for (const ingredient of ingredients) {
        await executeQuery(pool, {
            name: 'edit-ingredient-base',
            text: `UPDATE Ingredients SET ingredient_name = $1, ingredient_category_id = $2 WHERE id = $3`,
            values: [ingredient.name, ingredient.categoryId, ingredient.id, ingredient.quantityDescription.quantityDescriptorId]
        });

        await executeQuery(pool, {
            name: 'edit-ingredient-quantities',
            text: `UPDATE RecipesIngredientsMatch SET quantity_number = $1 
                WHERE recipe_id = $2 AND ingredient_id = $3`,
            values: [
                ingredient.quantity_number, 
                recipeId, 
                ingredient.id
            ]
        });
    }
}