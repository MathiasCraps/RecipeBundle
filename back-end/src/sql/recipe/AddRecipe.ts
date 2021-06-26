import { Pool } from "pg";
import { Recipe } from "../../model/RecipeData";
import { executeQuery } from "../../sql-utils/Database";
import { addIngredients } from '../ingredient/utils/AddIngredients';

export async function addRecipe(pool: Pool, recipeData: Recipe) {
    const insertedRecipe = await executeQuery(pool, {
        name: 'create-base-recipe',
        text: 'INSERT INTO Recipes (recipe_name, steps, image) VALUES ($1, $2, $3) RETURNING id;',
        values: [recipeData.title, recipeData.steps, recipeData.image]
    });

    const recipeId = insertedRecipe.rows[0].id;
    await addIngredients(pool, recipeData.ingredients, recipeId);

    return recipeId;
}