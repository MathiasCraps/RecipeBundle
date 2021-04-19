import { Pool } from 'pg';
import { Ingredient } from '../model/RecipeData';
import { executeQuery } from '../sql-utils/Database';

export async function updateIngredients(pool: Pool, ingredients: Ingredient[], recipeId: number): Promise<void> {
    for (const ingredient of ingredients) {
        await executeQuery(pool, {
            name: 'edit-ingredient-base',
            text: `UPDATE Ingredients SET ingredient_name = $1, ingredient_category_id = $2 WHERE id = $3`,
            values: [ingredient.name, ingredient.categoryId, ingredient.id]
        });

        await executeQuery(pool, {
            name: 'edit-ingredient-quantities',
            text: `UPDATE RecipesIngredientsMatch SET quantity_number = $1, quantity_name = $2 
                WHERE recipe_id = $3 AND ingredient_id = $4`,
            values: [
                ingredient.quantity_number, 
                ingredient.quantity_description, 
                recipeId, 
                ingredient.id
            ]
        });
    }
}