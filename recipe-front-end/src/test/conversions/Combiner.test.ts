import { combineToSingleValue } from '../../components/shopping-list/normalization/Combiner';
import { RulesHandler } from '../../components/shopping-list/normalization/RulesHandler';
import { SortedRecipeMap } from '../../components/shopping-list/normalization/SortRecipeMap';
import { QuantifiedIngredient } from '../../interfaces/Recipe';
import { QUANTITY_DESCRIPTION_1, QUANTITY_DESCRIPTION_2 } from '../mock/TestIngredientRule';
import { EMPTY_TEST_CATEGORY } from './SortRecipeMap.test';

const input: SortedRecipeMap = {
    apple: [{
      name: 'apple',
      quantity_number: 1,
      id: 1,
      categoryId: -1,
      category: EMPTY_TEST_CATEGORY,
      quantity_description_id: -1,
      quantityDescription: QUANTITY_DESCRIPTION_1
    }, {
        name: 'apple',
        quantity_number: 2,
        id: 1,
        categoryId: -1,
        category: EMPTY_TEST_CATEGORY,
        quantity_description_id: -1,
        quantityDescription: QUANTITY_DESCRIPTION_1
    }],
    floor: [{
        name: 'floor',
        quantity_number: 500,
        id: 2,
        categoryId: -1,
        category: EMPTY_TEST_CATEGORY,
        quantity_description_id: -1,
        quantityDescription: QUANTITY_DESCRIPTION_2
    }, {
        name: 'floor',
        quantity_number: 750,
        id: 3,
        categoryId: -1,
        category: EMPTY_TEST_CATEGORY,
        quantity_description_id: -1,
        quantityDescription: QUANTITY_DESCRIPTION_2
    }]
}

const rulesHandler = new RulesHandler([]);
describe('combineToSingleValue', () => {
    describe('passing apples and floor', () => {
        let ingredients: QuantifiedIngredient[];
        beforeEach(() => {
            ingredients = combineToSingleValue(input, rulesHandler);
        });

        test('returns array of two entries', () => {
            expect(ingredients.length).toBe(2);
        });

        test('combines apples correctly', () => {
            expect(ingredients[0]).toEqual({
                name: 'apple',
                quantity_description: 'stuk',
                quantity_number: 3
            });
        });

        test('combines floor correctly', () => {
            expect(ingredients[1]).toEqual({
                name: 'floor',
                quantity_description: 'gram',
                quantity_number: 1250
            });
        });
    });
});