import { Ingredient } from '../../../interfaces/Recipe';
import { InventoryItem } from '../../../redux/Store';
import { LinkedMap } from '../../../utils/ArrayUtils';

export function applyInventory(ingredients: Ingredient[], inventoryMap: LinkedMap<InventoryItem>): Ingredient[] {   
    const normalResults =  ingredients.map((ingredient) => {
        const entry = inventoryMap[ingredient.id];
        delete inventoryMap[ingredient.id];

        if (!entry) {
            return ingredient;
        }

        const difference = entry.desiredQuantity - entry.quantity;
        return {
            ...ingredient,
            quantity_number: ingredient.quantity_number + difference
        };
    });

    const keys = Object.keys(inventoryMap);
    const extraResults: Ingredient[] = [];
    for (const key of keys) {
        const { ingredient, desiredQuantity, quantity } = inventoryMap[key];
        const difference = desiredQuantity - quantity;

        if (difference > 0) {
            extraResults.push({
                ...ingredient,
                quantity_number: difference,
                quantity_description: '', // todo: link
                category: {
                    categoryId: 99999,
                    categoryName: 'Varia',
                    translations: {nl: 'Divers'}
                }
            })
        }
    }

    return normalResults.concat(extraResults);
}