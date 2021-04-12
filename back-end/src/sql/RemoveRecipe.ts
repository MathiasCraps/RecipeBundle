import { Pool } from "pg";
import { executeQuery } from "../sql-utils/Database";
import fs from "fs";
import { BASE_FILE_UPLOAD_DIRECTORY } from '..';

export async function removeRecipe(pool: Pool, recipeId: number): Promise<void> {
    const imagePath = (await executeQuery(pool, {
        name: 'select-recipe-image',
        text: 'SELECT image FROM Recipes where id = $1',
        values: [recipeId]
    })).rows[0].image;

    fs.unlinkSync(`${BASE_FILE_UPLOAD_DIRECTORY.replace('uploads/', '')}${imagePath}`);

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
}