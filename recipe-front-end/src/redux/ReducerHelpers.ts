import { Recipe } from '../interfaces/Recipe';
import { DayMenu } from './Store';

export function toggleIngredientsBoughtForMenus(allMenus: DayMenu[], impactedMenus: DayMenu[], ingredientsBought: boolean) {
    return allMenus.map((menu) => {
        // ignore the non-impacted menus
        if (impactedMenus.indexOf(menu) === -1) {
            return {... menu};
        }

        // modify the rest
        return {
            ...menu,
            ingredientsBought
        }
    });
}

export function replaceRecipe(allRecipes: Recipe[], withRecipe: Recipe): Recipe[] {
    for (let i = 0, n = allRecipes.length; i < n; i++) {
        if (withRecipe.id === allRecipes[i].id) {
            allRecipes[i] = withRecipe;
            break;
        }
    }

    return allRecipes;
}