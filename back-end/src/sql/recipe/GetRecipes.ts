import { pool } from "../..";
import { Recipe } from "../../model/RecipeData";
import { executeQuery } from "../../sql-utils/Database";
import { getRecipeById } from './GetRecipeById';

export async function getAllRecipes(): Promise<Recipe[]> {
    return new Promise(async (resolve, reject) => {
        const recipeIds = (await executeQuery(pool, 'SELECT id from Recipes')).rows;
        const recipes: Recipe[] = [];

        for (let { id } of recipeIds) {
            try {
                recipes.push(await getRecipeById(pool, id));
            } catch (err) {

            }
        }

        resolve(recipes);
    });
}