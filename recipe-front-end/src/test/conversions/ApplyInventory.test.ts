import { applyInventory } from '../../components/shopping-list/normalization/ApplyInventory';
import { QuantifiedIngredient } from '../../interfaces/Recipe';
import { InventoryItem } from '../../redux/Store';
import { LinkedMap } from '../../utils/ArrayUtils';
import { QUANTITY_DESCRIPTION_1 } from '../mock/TestIngredientRule';
import { EMPTY_TEST_CATEGORY } from './SortRecipeMap.test';

const TEST_INGREDIENT: QuantifiedIngredient = {
    name: 'apple',
    quantity_number: 1,
    id: 1,
    categoryId: -1,
    category: EMPTY_TEST_CATEGORY,
    quantity_description_id: -1,
    quantityDescription: QUANTITY_DESCRIPTION_1
};

const BASE_INVENTORY_ITEM: InventoryItem = {
    ingredient: TEST_INGREDIENT,
    quantity: 0,
    desiredQuantity: 0
};

function createInventoryMap(init: Partial<InventoryItem>): LinkedMap<InventoryItem> {
    return {
        [TEST_INGREDIENT.id]: {
            ...BASE_INVENTORY_ITEM,
            ...init
        }
    };
}


describe('applyInventory', () => {
    describe('with an inventory of 5', () => {
        describe('and a desired minimal inventory of 5', () => {
            const adjustedInventoryMap = createInventoryMap({
                desiredQuantity: 5,
                quantity: 5
            });

            describe('where we require 1 item for the week', () => {
                it('returns the need to buy 1 item', () => {
                    const [{quantity_number}] = applyInventory([TEST_INGREDIENT], adjustedInventoryMap)
                    expect(quantity_number).toBe(1);
                });
            });

            describe('where we require no items for the week', () => {
                it('returns the need to buy no items', () => {
                    expect(applyInventory([], adjustedInventoryMap).length).toBe(0);
                });
            });
        });

        describe('and a desired minimal inventory of 10', () => {
            const adjustedInventoryMap = createInventoryMap({
                desiredQuantity: 10,
                quantity: 5
            });

            describe('where we require 1 item for the week', () => {
                it('returns the need to buy 6 items', () => {
                    const [{quantity_number}] = applyInventory([TEST_INGREDIENT], adjustedInventoryMap)
                    expect(quantity_number).toBe(6);
                });
            });

            describe('where we require no items for the week', () => {
                it('returns the need to buy 5 items', () => {
                    const [{quantity_number}] = applyInventory([], adjustedInventoryMap)
                    expect(quantity_number).toBe(5);
                });
            });
        });

        describe('and a desired minimal inventory of 2', () => {
            const adjustedInventoryMap = createInventoryMap({
                desiredQuantity: 2,
                quantity: 5
            });
            describe('where we require 1 item for the week', () => {
                it('returns the need to buy no items', () => {
                    expect(applyInventory([], adjustedInventoryMap).length).toBe(0);
                });
            });

            describe('where we require no items for the week', () => {
                it('returns the need to buy no items', () => {
                    expect(applyInventory([], adjustedInventoryMap).length).toBe(0);
                });
            });
        });
    });
});
