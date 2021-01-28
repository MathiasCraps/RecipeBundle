import { pool } from "..";
import { ApplicationData, DayMenu, Recipe } from "../model/RecipeData";
import { executeQuery } from "../sql-utils/Database";

export async function getAllRecipes(): Promise<ApplicationData> {
    return new Promise(async (resolve, reject) => {
        const recipes = (await executeQuery(pool, 'SELECT * FROM Recipes')).rows;
        const results: Recipe[] = [];
        const menus: DayMenu[] = [];

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

            const menusFromDatabase = (await executeQuery(pool, {
                name: 'get-menus',
                text: `SELECT planned_time, menu_id FROM MenuPlanning WHERE recipe_id = $1`,
                values: [recipeId]
            })).rows;

            results.push({
                title: recipe.recipe_name,
                steps: recipe.steps,
                ingredients: ingredients.map((ingredient: any) => {
                    return { 
                        quantity_number: Number(ingredient.quantity_number),
                        quantity_description: ingredient.quantity_name, 
                        name: ingredient.ingredient_name,
                    };
                }),
                image: `${process.env.DOMAIN}/${recipe.image}`,
                id: recipeId
            });

            menus.push(...menusFromDatabase.map((menu: any) => {
                return {
                    menuId: menu.menu_id,
                    recipeId,
                    date: Number(menu.planned_time)
                };
            }));
        }

        resolve({
            menus: menus,
            recipes: results
        });
    });
}