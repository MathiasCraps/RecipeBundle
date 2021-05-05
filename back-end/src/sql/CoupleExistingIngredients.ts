import { Pool } from 'pg';
import { Ingredient } from "../model/RecipeData";
import { executeQuery } from '../sql-utils/Database';

export async function coupleExistingIngredients(pool: Pool, ingredients: Ingredient[], recipeId: number) {
    for (let ingredient of ingredients) {
        await executeQuery(pool, {
            name: 'match-ingredient-and-recipe',
            text: `INSERT INTO RecipesIngredientsMatch (recipe_id, ingredient_id, quantity_number, quantity_name) 
                VALUES($1, $2, $3, $4);`,
            values: [recipeId, ingredient.id, ingredient.quantity_number, ingredient.quantity_description]
        });
    }
}