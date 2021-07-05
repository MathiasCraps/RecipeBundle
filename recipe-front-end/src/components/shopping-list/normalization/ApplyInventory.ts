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
    const normalResults = ingredients.reduce((previous: QuantifiedIngredient[], ingredient: QuantifiedIngredient) => {
        const entry = inventoryMap[ingredient.id];
        delete inventoryMap[ingredient.id];

        if (!entry) {
            return previous;
        }

        const quantityNumber = ingredient.quantity_number -entry.desiredQuantity - entry.quantity;

        if (quantityNumber > 0) {
            return previous.concat([{
                ...ingredient,
                quantity_number: quantityNumber
            }]);
        }
        
        return previous;
    }, []);

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