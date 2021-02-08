import { Ingredient } from '../../../interfaces/Recipe';

export type SortedRecipeMap = { [key: string]: Ingredient[] };
export function sortByIngredient(ingredients: Ingredient[]): SortedRecipeMap {
    const recipeMap: SortedRecipeMap = {};
    for (const ingredient of ingredients) {
        if (!recipeMap[ingredient.name]) {
            recipeMap[ingredient.name] = [];
        }

        recipeMap[ingredient.name].push(ingredient);
    }
    return recipeMap;
}