import { QuantifiedIngredient } from '../../../interfaces/Recipe';

export type SortedRecipeMap = { [key: string]: QuantifiedIngredient[] };
export function sortByIngredient(ingredients: QuantifiedIngredient[]): SortedRecipeMap {
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