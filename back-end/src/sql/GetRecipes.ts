import { pool } from "..";
import { Recipe } from "../model/RecipeData";
import { executeQuery } from "../sql-utils/Database";

export async function getAllRecipes(): Promise<Recipe[]> {
    return new Promise(async (resolve, reject) => {
        const recipeData = (await executeQuery(pool, 'SELECT * FROM Recipes')).rows;
        const recipes: Recipe[] = [];

        for (let recipe of recipeData) {
            const recipeId = recipe.id;
            const ingredients = (await executeQuery(pool, {
                name: 'get-ingredients-recipe',
                text: `SELECT Ingredients.ingredient_name, RecipesIngredientsMatch.quantity_name, RecipesIngredientsMatch.quantity_number 
                FROM Ingredients
                INNER JOIN RecipesIngredientsMatch ON RecipesIngredientsMatch.ingredient_id = Ingredients.id
                WHERE RecipesIngredientsMatch.recipe_id = $1`,
                values: [recipeId]
            })).rows;

            recipes.push({
                title: recipe.recipe_name,
                steps: recipe.steps,
                ingredients: ingredients.map((ingredient: any) => {
                    return { 
                        quantity_number: Number(ingredient.quantity_number),
                        quantity_description: ingredient.quantity_name, 
                        name: ingredient.ingredient_name,
                        category: 0
                    };
                }),
                image: `${process.env.DOMAIN}/${recipe.image}`,
                id: recipeId
            });
        }

        resolve(recipes);
    });
}