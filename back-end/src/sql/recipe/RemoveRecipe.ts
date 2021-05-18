import { Pool } from "pg";
import { executeQuery } from "../../sql-utils/Database";

export async function removeRecipe(pool: Pool, recipeId: number): Promise<string> {
    const imagePath = (await executeQuery(pool, {
        name: 'select-recipe-image',
        text: 'SELECT image FROM Recipes where id = $1',
        values: [recipeId]
    })).rows[0].image;
    
    await executeQuery(pool, {
        name: 'remove-ingredient-match',
        text: 'DELETE FROM RecipesIngredientsMatch WHERE recipe_id = $1',
        values: [recipeId]
    });

    await executeQuery(pool, {
        name: 'remove-base-recipe',
        text: 'DELETE FROM Recipes where id = $1',
        values: [recipeId]
    });

    return imagePath;
}