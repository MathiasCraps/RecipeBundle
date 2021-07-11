import { BaseIngredient, QuantifiedIngredient } from '../../../interfaces/Recipe';
import { InventoryItem } from '../../../redux/Store';
import { LinkedMap } from '../../../utils/ArrayUtils';

function applyInventoryAndPushUsableEntries(
    baseIngredient: BaseIngredient,
    rawRequired: number,
    inventoryItem: InventoryItem | undefined,
    existingEntries: QuantifiedIngredient[]
): void {
    const { quantity: availableQuantity, desiredQuantity } = inventoryItem || { quantity: 0, desiredQuantity: 0 }
    const quantityNumber = rawRequired + (desiredQuantity - availableQuantity);

    if (quantityNumber > 0) {
        existingEntries.push({
            ...baseIngredient,
            quantity_number: quantityNumber
        });
    }
}


export function applyInventory(ingredients: QuantifiedIngredient[], inventoryMap: LinkedMap<InventoryItem>): QuantifiedIngredient[] {
    const results: QuantifiedIngredient[] = [];

    // ingredients in scheduled recipes
    ingredients.forEach((ingredient: QuantifiedIngredient) => {
        const entry = inventoryMap[ingredient.id];
        applyInventoryAndPushUsableEntries(ingredient, ingredient.quantity_number, entry, results);
        delete inventoryMap[ingredient.id];    
    });

    // ingredients in inventory, but not in scheduled recipes
    const keys = Object.keys(inventoryMap);
    for (const key of keys) {
        const inventoryItem = inventoryMap[key];
        applyInventoryAndPushUsableEntries(inventoryItem.ingredient, 0, inventoryItem, results);
    }

    return results;
}