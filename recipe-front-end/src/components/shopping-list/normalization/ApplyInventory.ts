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

function calculateIngredientDifference(
    baseIngredient: BaseIngredient,
    rawRequired: number,
    { quantity: availableQuantity, desiredQuantity }: InventoryItem
): QuantifiedIngredient | undefined {
    const quantityNumber = rawRequired + (desiredQuantity - availableQuantity);

    if (quantityNumber <= 0) {
        return undefined;
    }

    return {
        ...baseIngredient,
        quantity_number: quantityNumber,
        ...baseQuantityAndCategory
    }
}

export function applyInventory(ingredients: QuantifiedIngredient[], inventoryMap: LinkedMap<InventoryItem>): QuantifiedIngredient[] {
    const normalResults = ingredients.reduce((previous: QuantifiedIngredient[], ingredient: QuantifiedIngredient) => {
        const inventoryEntry = inventoryMap[ingredient.id];
        delete inventoryMap[ingredient.id];

        const presentableQuantifiedIngredient = calculateIngredientDifference(ingredient, ingredient.quantity_number, inventoryEntry);

        if (presentableQuantifiedIngredient) {
            return previous.concat([presentableQuantifiedIngredient]);
        }

        return previous;
    }, []);

    // ingredients in inventory, but not in scheduled recipes
    const keys = Object.keys(inventoryMap);
    const extraResults: QuantifiedIngredient[] = [];
    for (const key of keys) {
        const inventoryItem = inventoryMap[key];
        const presentableQuantifiedIngredient = calculateIngredientDifference(inventoryItem.ingredient, 0, inventoryItem)

        if (presentableQuantifiedIngredient) {
            extraResults.push(presentableQuantifiedIngredient);
        }
    }

    return normalResults.concat(extraResults);
}