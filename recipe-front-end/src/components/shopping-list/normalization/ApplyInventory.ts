import { Ingredient } from '../../../interfaces/Recipe';
import { InventoryItem } from '../../../redux/Store';
import { LinkedMap } from '../../../utils/ArrayUtils';

export function applyInventory(ingredients: Ingredient[], inventoryMap: LinkedMap<InventoryItem>): Ingredient[] {
    return ingredients.map((ingredient) => {
        const entry = inventoryMap[ingredient.id];
        if (!entry) {
            return ingredient;
        }

        const difference = entry.desiredQuantity - entry.quantity;
        return {
            ...ingredient,
            quantity_number: ingredient.quantity_number + difference
        };
    });
}