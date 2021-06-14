import { sortByIngredient, SortedRecipeMap } from '../../components/shopping-list/normalization/SortRecipeMap';
import { Category, QuantifiedIngredient } from '../../interfaces/Recipe';
import { QUANTITY_DESCRIPTION_1 } from '../mock/TestIngredientRule';

export const EMPTY_TEST_CATEGORY: Category = {
    categoryId: -1,
    categoryName: 'test',
    translations: { nl: 'unit-test' }
};

const APPLE_INGREDIENTS: QuantifiedIngredient[] = [{
    name: 'apple',
    quantity_number: 1,
    categoryId: -1,
    id: 1,
    category: EMPTY_TEST_CATEGORY,
    quantity_description_id: -1,
    quantityDescription: QUANTITY_DESCRIPTION_1
},
{
    name: 'apple',
    quantity_number: 1,
    categoryId: -1,
    id: 1,
    category: EMPTY_TEST_CATEGORY,
    quantity_description_id: -1,
    quantityDescription: QUANTITY_DESCRIPTION_1
}];

const PEAR_INGREDIENTS: QuantifiedIngredient[] = [{
    name: 'pear',
    quantity_number: 1,
    categoryId: -1,
    id: 2,
    category: EMPTY_TEST_CATEGORY,
    quantity_description_id: -1,
    quantityDescription: QUANTITY_DESCRIPTION_1
}];

const TEST_INGREDIENTS: QuantifiedIngredient[] = [
    ...APPLE_INGREDIENTS,
    ...PEAR_INGREDIENTS
]

describe('sortByIngredient', () => {
    describe('when called with three ingredients', () => {
        let result: SortedRecipeMap;

        beforeEach(() => {
            result = sortByIngredient(TEST_INGREDIENTS)
        });

        test('should have an apple property of type array', () => {
            expect(Array.isArray(result.apple)).toBe(true);
        });

        test('should have two items in apple property', () => {
            expect(result.apple.length).toBe(2);
        });

        test('should match ingredients in input', () => {
            expect(result.apple[0]).toBe(APPLE_INGREDIENTS[0]);
            expect(result.apple[1]).toBe(APPLE_INGREDIENTS[1]);
        })

        test('should have a pear property of type array', () => {
            expect(Array.isArray(result.pear)).toBe(true);
        });

        test('should have one item in pear property', () => {
            expect(result.pear.length).toBe(1);
        });

        test('should match ingredient in input', () => {
            expect(result.pear[0]).toBe(PEAR_INGREDIENTS[0]);
        });
    })
});