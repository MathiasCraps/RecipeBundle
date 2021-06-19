import { Pool } from 'pg';
import { Ingredient } from "../../model/RecipeData";
import { executeQuery } from '../../sql-utils/Database';

export async function addIngredients(pool: Pool, ingredients: Ingredient[], recipeId: number | undefined) {
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
                text: 'INSERT INTO Ingredients (ingredient_name, ingredient_category_id, ingredient_quantity_id) VALUES ($1, $2, $3) RETURNING id;',
                values: [ingredient.name, ingredient.categoryId, ingredient.quantity_description_id]
            });

            id = ingredientResult.rows[0].id;
        }

        if (recipeId !== undefined) {
            await executeQuery(pool, {
                name: 'match-ingredient-and-recipe',
                text: `INSERT INTO RecipesIngredientsMatch (recipe_id, ingredient_id, quantity_number) 
                    VALUES($1, $2, $3);`,
                values: [recipeId, id, ingredient.quantity_number]
            });    
        }
    }
}