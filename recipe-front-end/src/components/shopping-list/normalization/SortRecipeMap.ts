import { Ingredient } from '../../../interfaces/Recipe';

export type SortedRecipeMap = { [key: string]: Ingredient[] };
export function sortByIngredient(ingredients: Ingredient[]): SortedRecipeMap {
    const recipeMap: SortedRecipeMap = {};
    for (const ingredient of ingredients) {
        const ingredientName = ingredient.name.toLowerCase();
        if (!recipeMap[ingredientName]) {
            recipeMap[ingredientName] = [];
        }

        recipeMap[ingredientName].push(ingredient);
    }
    return recipeMap;
}