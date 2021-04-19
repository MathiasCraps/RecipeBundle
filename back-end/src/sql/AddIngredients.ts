import { Pool } from 'pg';
import { Ingredient } from "../model/RecipeData";
import { executeQuery } from '../sql-utils/Database';

export async function addIngredients(pool: Pool, ingredients: Ingredient[], recipeId: number) {
    for (let ingredient of ingredients) {
        let ingredientResult = await executeQuery(pool, {
            name: 'add-ingredient',
            text: 'INSERT INTO Ingredients (ingredient_name, ingredient_category_id) VALUES ($1, $2) RETURNING id;',
            values: [ingredient.name, ingredient.categoryId]
        });
        const id = ingredientResult.rows[0].id;

        await executeQuery(pool, {
            name: 'match-ingredient-and-recipe',
            text: `INSERT INTO RecipesIngredientsMatch (recipe_id, ingredient_id, quantity_number, quantity_name) 
                VALUES($1, $2, $3, $4);`,
            values: [recipeId, id, ingredient.quantity_number, ingredient.quantity_description]
        });
    }
}