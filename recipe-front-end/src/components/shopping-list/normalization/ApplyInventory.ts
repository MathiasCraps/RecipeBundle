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
    ingredient: QuantifiedIngredient | BaseIngredient, 
    inventoryItem: InventoryItem
): QuantifiedIngredient | undefined {
    const quantityNumber = ((ingredient as QuantifiedIngredient).quantity_number || 0) 
        - inventoryItem.desiredQuantity 
        - inventoryItem.quantity;

    if (quantityNumber <= 0) {
        return undefined;
    }

    return {
        ...ingredient,
        quantity_number: quantityNumber,
        ...baseQuantityAndCategory
    }
}

export function applyInventory(ingredients: QuantifiedIngredient[], inventoryMap: LinkedMap<InventoryItem>): QuantifiedIngredient[] {
    const normalResults = ingredients.reduce((previous: QuantifiedIngredient[], ingredient: QuantifiedIngredient) => {
        const inventoryEntry = inventoryMap[ingredient.id];
        delete inventoryMap[ingredient.id];

        if (!inventoryEntry) {
            return previous;
        }

        const presentableQuantifiedIngredient = calculateIngredientDifference(ingredient, inventoryEntry);

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
        const presentableQuantifiedIngredient = calculateIngredientDifference(inventoryItem.ingredient, inventoryItem)

        if (presentableQuantifiedIngredient) {
            extraResults.push(presentableQuantifiedIngredient);
        }
    }

    return normalResults.concat(extraResults);
}