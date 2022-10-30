import { BaseIngredient, QuantifiedIngredient } from '../../../interfaces/Recipe';
import { InventoryItem } from '../../../redux/Store';
import { LinkedMap } from '../../../utils/ArrayUtils';

function applyInventoryAndPushUsableEntries(
    baseIngredient: BaseIngredient,
    requiredAsPartOfPlannedMenu: number,
    inventoryItem: InventoryItem | undefined,
    existingEntries: QuantifiedIngredient[]
): void {
    const { quantity: availableQuantity, desiredQuantity } = inventoryItem || { quantity: 0, desiredQuantity: 0 }
    const quantityNumber = requiredAsPartOfPlannedMenu + (desiredQuantity - availableQuantity);

    if (quantityNumber > 0) {
        existingEntries.push({
            ...baseIngredient,
            quantity_number: quantityNumber
        });
    }
}


export function applyInventory(ingredients: QuantifiedIngredient[], inventoryMap: LinkedMap<InventoryItem>): QuantifiedIngredient[] {
    const results: QuantifiedIngredient[] = [];

    // To avoid overlap between scheduled ingredients and inventory-only requests we make a shallow copy.
    // The copy ensures we respect the integrity of the original data.
    // Since we only need top level properties (id) we do not need a deep-level copy.
    const shallowCloneOfInventory = {...inventoryMap};

    // ingredients in scheduled recipes
    ingredients.forEach((ingredient: QuantifiedIngredient) => {
        const inventoryEntry = shallowCloneOfInventory[ingredient.id];
        applyInventoryAndPushUsableEntries(ingredient, ingredient.quantity_number, inventoryEntry, results);
        delete shallowCloneOfInventory[ingredient.id];    
    });


    // ingredients in inventory, but not in scheduled recipes
    const keys = Object.keys(shallowCloneOfInventory);
    for (const key of keys) {
        const inventoryEntry = shallowCloneOfInventory[key];
        applyInventoryAndPushUsableEntries(inventoryEntry.ingredient, 0, inventoryEntry, results);
    }

    return results;
}