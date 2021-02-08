import { Ingredient } from '../../../interfaces/Recipe';
import { DayMenu } from '../../../redux/Store';

export type SortedRecipeMap = { [key: string]: Ingredient[] };
export function sortByIngredient(menus: DayMenu[]): SortedRecipeMap {
    const recipeMap: SortedRecipeMap = {};

    for (const dayMenu of menus) {
        for (const ingredient of dayMenu.recipe.ingredients) {
            if (!recipeMap[ingredient.name]) {
                recipeMap[ingredient.name] = [];
            }

            recipeMap[ingredient.name].push(ingredient);
        }
    }

    return recipeMap;
}