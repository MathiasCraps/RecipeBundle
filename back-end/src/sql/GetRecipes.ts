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
                text: `SELECT Ingredients.ingredient_name, RecipesIngredientsMatch.quantity_name, RecipesIngredientsMatch.quantity_number, IngredientCategory.category_name, IngredientCategory.id as category_id 
                FROM Ingredients
                INNER JOIN RecipesIngredientsMatch ON RecipesIngredientsMatch.ingredient_id = Ingredients.id
                INNER JOIN IngredientCategory ON IngredientCategory.id = Ingredients.ingredient_category_id
                WHERE RecipesIngredientsMatch.recipe_id = $1`,
                values: [recipeId]
            })).rows;

            recipes.push({
                title: recipe.recipe_name,
                steps: recipe.steps,
                ingredients: ingredients.map((ingredient: any) => {
                    console.log(ingredient);
                    return { 
                        quantity_number: Number(ingredient.quantity_number),
                        quantity_description: ingredient.quantity_name, 
                        name: ingredient.ingredient_name,
                        categoryId: Number(ingredient.category_id),
                        categoryName: ingredient.category_name
                    };
                }),
                image: `${process.env.DOMAIN}/${recipe.image}`,
                id: recipeId
            });
        }

        resolve(recipes);
    });
}