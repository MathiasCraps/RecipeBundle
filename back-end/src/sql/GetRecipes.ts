import { pool } from "..";
import { Recipe } from "../model/RecipeData";
import { executeQuery } from "../sql-utils/Database";

export async function getAllRecipes(): Promise<Recipe[]> {
    return new Promise((resolve, reject) => {
        pool.connect(async (error, client, done) => {
            if (error) {
                done();
                return;
            }
            const recipes = (await executeQuery(client, 'SELECT * FROM Recipes')).rows;
            const results: Recipe[] = [];

            for (let recipe of recipes) {
                const recipeId = recipe.id;
                const ingredients = (await executeQuery(client, {
                    name: 'get-ingredients-recipe',
                    text: `SELECT Ingredients.ingredient_name, RecipesIngredientsMatch.quantity FROM Ingredients
                    INNER JOIN RecipesIngredientsMatch ON RecipesIngredientsMatch.ingredient_id = Ingredients.id
                    WHERE RecipesIngredientsMatch.recipe_id = $1`,
                    values: [recipeId]
                })).rows;

                console.log(ingredients)

                results.push({
                    title: recipe.recipe_name,
                    steps: recipe.steps,
                    ingredients: ingredients.map((ingredient: any) => { 
                        return { quantity: ingredient.quantity, name: ingredient.ingredient_name }
                    }),
                    image: recipe.image
                })
            }

            resolve(results);    
        });
    })
}