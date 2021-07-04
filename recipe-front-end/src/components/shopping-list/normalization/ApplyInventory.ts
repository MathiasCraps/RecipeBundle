import { QuantifiedIngredient } from '../../../interfaces/Recipe';
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

export function applyInventory(ingredients: QuantifiedIngredient[], inventoryMap: LinkedMap<InventoryItem>): QuantifiedIngredient[] {
    const normalResults = ingredients.map((ingredient) => {
        const entry = inventoryMap[ingredient.id];
        delete inventoryMap[ingredient.id];

        if (!entry) {
            return ingredient;
        }

        const difference = entry.desiredQuantity - entry.quantity;
        return {
            ...ingredient,
            quantity_number: ingredient.quantity_number - difference
        };
    });

    const keys = Object.keys(inventoryMap);
    const extraResults: QuantifiedIngredient[] = [];
    for (const key of keys) {
        const { ingredient, desiredQuantity, quantity } = inventoryMap[key];
        const difference = desiredQuantity - quantity;

        if (difference > 0) {
            extraResults.push({
                ...ingredient,
                quantity_number: difference,
                ...baseQuantityAndCategory // to be replaced in follow-up with linked data
            });
        }
    }

    return normalResults.concat(extraResults);
}