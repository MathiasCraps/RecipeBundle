import { Recipe } from "../model/RecipeData";

export function isRecipe(data: unknown): data is Recipe {
    const recipe = data as Recipe;
    if (typeof recipe !== 'object') {
        return false;
    }

    return Boolean(recipe.title && recipe.ingredients?.length && recipe.steps);
}