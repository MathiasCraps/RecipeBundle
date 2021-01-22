import { DayMenu, Recipe } from "../model/RecipeData";

export function isRecipe(data: unknown): data is Recipe {
    const recipe = data as Recipe;
    if (typeof recipe !== 'object' || recipe === null) {
        return false;
    }

    return Boolean(recipe.title && recipe.ingredients?.length && recipe.steps);
}

export function isDayMenu(data: unknown): data is DayMenu {
    const dayMenu = data as DayMenu;
    if (typeof dayMenu !== 'object' || dayMenu === null) {
        return false;
    }

    return Boolean(typeof dayMenu.date === 'number' && typeof dayMenu.recipeId === 'number');
}