import { Pool } from 'pg';
import { Ingredient } from "../../model/RecipeData";
import { executeQuery } from '../../sql-utils/Database';

export async function addIngredients(pool: Pool, ingredients: Ingredient[], recipeId: number) {
    for (let ingredient of ingredients) {
        let id = ingredient.id;
        let baseIngredientDoesNotExist = (ingredient.id < 0) || // assuming negative index = not existing
            (await executeQuery(pool, {
                name: 'test-ingredient-existence',
                text: 'SELECT id FROM Ingredients WHERE id = $1',
                values: [id]
            })).rowCount === 0; // or by verifying if id is valid

        if (baseIngredientDoesNotExist) {
            let ingredientResult = await executeQuery(pool, {
                name: 'add-ingredient',
                text: 'INSERT INTO Ingredients (ingredient_name, ingredient_category_id) VALUES ($1, $2) RETURNING id;',
                values: [ingredient.name, ingredient.categoryId]
            });

            id = ingredientResult.rows[0].id;
        }

        await executeQuery(pool, {
            name: 'match-ingredient-and-recipe',
            text: `INSERT INTO RecipesIngredientsMatch (recipe_id, ingredient_id, quantity_number, quantity_name) 
                VALUES($1, $2, $3, $4);`,
            values: [recipeId, id, ingredient.quantity_number, ingredient.quantity_description]
        });
    }
}