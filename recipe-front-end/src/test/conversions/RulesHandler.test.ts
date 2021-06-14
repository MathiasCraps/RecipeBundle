import { RulesHandler } from '../../components/shopping-list/normalization/RulesHandler';
import { QuantifiedIngredient } from '../../interfaces/Recipe';
import { QUANTITY_DESCRIPTION_1, TEST_INGREDIENT_RULE, TEST_RULE_QUANTIFY_FACTOR } from '../mock/TestIngredientRule';
import { EMPTY_TEST_CATEGORY } from './SortRecipeMap.test';

const TEST_INGREDIENT_NAME = 'testing-ingredient';
const TEST_INGREDIENT: QuantifiedIngredient = {
    name: TEST_INGREDIENT_NAME,
    quantity_number: 1,
    id: -1,
    categoryId: -1,
    category: EMPTY_TEST_CATEGORY,
    quantity_description_id: -1,
    quantityDescription: QUANTITY_DESCRIPTION_1
};

describe('RulesHandler', () => {
    let rulesHandler: RulesHandler;
    describe('with a TestHandler', () => {
        beforeEach(() => {
            rulesHandler = new RulesHandler([TEST_INGREDIENT_RULE]);   
        })
        
        describe('calls normalize_ with one test ingredient', () => {
            let result: QuantifiedIngredient[];

            beforeEach(() => {
                result = rulesHandler.normalize([TEST_INGREDIENT]);
            });

            test('keeps exactly one ingredient', () => {
                expect(result.length).toBe(1);
            });

            test(`keeps the ingredient name to ${TEST_INGREDIENT_NAME}`, () => {
                expect(result[0].name).toBe(TEST_INGREDIENT_NAME)
            });

            test(`multiplies the quantity to ${TEST_RULE_QUANTIFY_FACTOR}`, () => {
                expect(result[0].quantity_number).toBe(TEST_RULE_QUANTIFY_FACTOR);
            });
        })
    })
})