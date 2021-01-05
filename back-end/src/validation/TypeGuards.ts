import { Recipe } from "../model/RecipeData";

export function isRecipe(data: unknown): data is Recipe {
    const castedRecipe = data as Recipe;
    if (typeof castedRecipe !== 'object' || castedRecipe === null) {
        return false; // not an object
    }

    return Boolean(castedRecipe.title && castedRecipe.ingredients && castedRecipe.steps && castedRecipe.image);
}