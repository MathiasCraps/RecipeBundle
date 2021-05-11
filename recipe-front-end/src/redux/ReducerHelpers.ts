import { Recipe } from '../interfaces/Recipe';
import { removeFromArray } from '../utils/ArrayUtils';
import { DayMenu, InventoryItem, UpdateInventoryModification } from './Store';

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

export function modifyInventory(
    oldInventory: InventoryItem[], 
    item: InventoryItem, 
    action: UpdateInventoryModification) {

    if (action === 'add') {
        return oldInventory.concat([item]);
    }

    return removeFromArray(item, [... oldInventory]);
}