import { pool } from "..";
import { Recipe } from "../model/RecipeData";
import { executeQuery } from "../sql-utils/Database";

export async function getAllRecipes(): Promise<Recipe[]> {
    return new Promise(async (resolve, reject) => {
        const recipes = (await executeQuery(pool, 'SELECT * FROM Recipes')).rows;
        const results: Recipe[] = [];

        for (let recipe of recipes) {
            const recipeId = recipe.id;
            const ingredients = (await executeQuery(pool, {
                name: 'get-ingredients-recipe',
                text: `SELECT Ingredients.ingredient_name, RecipesIngredientsMatch.quantity_name, RecipesIngredientsMatch.quantity_number 
                FROM Ingredients
                INNER JOIN RecipesIngredientsMatch ON RecipesIngredientsMatch.ingredient_id = Ingredients.id
                WHERE RecipesIngredientsMatch.recipe_id = $1`,
                values: [recipeId]
            })).rows;

            results.push({
                title: recipe.recipe_name,
                steps: recipe.steps,
                ingredients: ingredients.map((ingredient: any) => {
                    return { 
                        quantity_number: Number(ingredient.quantity_number),
                        quantity_description: ingredient.quantity_name, 
                        name: ingredient.ingredient_name 
                    };
                }),
                image: recipe.image
            })
        }

        resolve(results);
    });
}