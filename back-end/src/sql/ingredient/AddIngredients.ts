import { Pool } from 'pg';
import { Ingredient } from "../../model/RecipeData";
import { addSingleIngredient } from './AddSingleIngredient';

export async function addIngredients(pool: Pool, ingredients: Ingredient[], recipeId: number | undefined) {
    for (let ingredient of ingredients) {
        try {
            await addSingleIngredient(pool, ingredient, recipeId);
        } catch (err) {
            console.log('failed');
        }
    }
}