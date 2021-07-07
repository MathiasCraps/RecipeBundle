import { BaseIngredient, QuantifiedIngredient } from '../../../interfaces/Recipe';
import { InventoryItem } from '../../../redux/Store';
import { LinkedMap } from '../../../utils/ArrayUtils';

const baseQuantityAndCategory = {// to be replaced in follow-up with linked data = {
    quantity_description: 'stuk', // todo: link
    category: {
        categoryId: 99999,
        categoryName: 'Varia',
        translations: { nl: 'Divers' }
    }
};

function applyInventoryAndPushUsableEntries(
    baseIngredient: BaseIngredient,
    rawRequired: number,
    { quantity: availableQuantity, desiredQuantity }: InventoryItem,
    existingEntries: QuantifiedIngredient[]
): QuantifiedIngredient[] {
    const quantityNumber = rawRequired + (desiredQuantity - availableQuantity);

    if (quantityNumber <= 0) {
        return existingEntries;
    }

    return existingEntries.concat([{
        ...baseIngredient,
        quantity_number: quantityNumber,
        ...baseQuantityAndCategory
    }]);
}


export function applyInventory(ingredients: QuantifiedIngredient[], inventoryMap: LinkedMap<InventoryItem>): QuantifiedIngredient[] {
    const results: QuantifiedIngredient[] = [];

    // ingredients in scheduled recipes
    ingredients.forEach((ingredient: QuantifiedIngredient) => {
        delete inventoryMap[ingredient.id];
        applyInventoryAndPushUsableEntries(ingredient, ingredient.quantity_number, inventoryMap[ingredient.id], results);
    });

    // ingredients in inventory, but not in scheduled recipes
    const keys = Object.keys(inventoryMap);
    for (const key of keys) {
        const inventoryItem = inventoryMap[key];
        applyInventoryAndPushUsableEntries(inventoryItem.ingredient, 0, inventoryItem, results);
    }

    return results;
}