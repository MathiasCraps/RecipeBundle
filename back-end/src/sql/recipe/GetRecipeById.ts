import { Pool } from 'pg';
import { Ingredient, Recipe } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

export async function getRecipeById(pool: Pool, recipeId: number): Promise<Recipe> {
    const recipe = (await executeQuery(pool, {
        name: 'get-recipe-by-id',
        text: 'SELECT * FROM Recipes where id = $1',
        values: [recipeId]
    })).rows[0];

    const ingredients = (await executeQuery(pool, {
        name: 'get-ingredients-recipe',
        text: `SELECT Ingredients.ingredient_name, RecipesIngredientsMatch.quantity_name, RecipesIngredientsMatch.quantity_number, IngredientCategory.category_name, IngredientCategory.id as category_id, Ingredients.id as ingredient_id
        FROM Ingredients
        INNER JOIN RecipesIngredientsMatch ON RecipesIngredientsMatch.ingredient_id = Ingredients.id
        INNER JOIN IngredientCategory ON IngredientCategory.id = Ingredients.ingredient_category_id
        WHERE RecipesIngredientsMatch.recipe_id = $1`,
        values: [recipeId]
    })).rows;

    return {
        title: recipe.recipe_name,
        steps: recipe.steps,
        ingredients: ingredients.map((ingredient: any): Ingredient => {
            return {
                id: Number(ingredient.ingredient_id),
                quantity_number: Number(ingredient.quantity_number),
                quantity_description: ingredient.quantity_name,
                name: ingredient.ingredient_name,
                categoryId: Number(ingredient.category_id),
                categoryName: ingredient.category_name
            };
        }),
        image: `${process.env.DOMAIN}/${recipe.image}`,
        id: recipeId
    };
}