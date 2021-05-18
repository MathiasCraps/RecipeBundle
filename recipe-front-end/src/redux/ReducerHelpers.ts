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
    const shallowCopy = [... oldInventory];

    if (action === 'add') {
        return shallowCopy.concat([item]);
    }

    if (action === 'update') {
        for (let i = 0; i < shallowCopy.length; i++) {
            const inventoryItem = shallowCopy[i];
            if (inventoryItem.ingredient.id === item.ingredient.id) {
                shallowCopy[i] = item;
                break;
            }
        }
        return shallowCopy;
    }

    return removeFromArray(item, shallowCopy);
}