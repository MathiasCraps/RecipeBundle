import { Pool } from 'pg';
import { Ingredient } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

export async function removeIngredients(pool: Pool, ingredients: Ingredient[], recipeId: number): Promise<void> {
    for (const { id: ingredientId } of ingredients) {
        await executeQuery(pool, {
            name: 'remove-ingredient-match',
            text: 'DELETE FROM RecipesIngredientsMatch WHERE recipe_id = $1 AND ingredient_id = $2',
            values: [recipeId, ingredientId]
        });    
    }
}