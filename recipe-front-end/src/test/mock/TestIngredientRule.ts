import { AbstractQuantityConversionRule } from '../../components/shopping-list/normalization/AbstractQuantityConversionRule';
import { QuantifiedIngredient } from '../../interfaces/Recipe';

export const QUANTITY_DESCRIPTION_NAME = 'test';
export const TEST_RULE_QUANTIFY_FACTOR = 100;
export const TEST_RULE_TO_UNIT_NAME = 'test-converted';
export class TestIngredientRule extends AbstractQuantityConversionRule {
    quantifyFactor = TEST_RULE_QUANTIFY_FACTOR;
    toUnit = TEST_RULE_TO_UNIT_NAME;
    
    canHandle(ingredient: QuantifiedIngredient): boolean {
        return ingredient.quantity_description === QUANTITY_DESCRIPTION_NAME;
    }
}