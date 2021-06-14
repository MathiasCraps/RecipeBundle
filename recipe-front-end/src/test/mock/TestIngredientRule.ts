import { QuantityConversionRule } from '../../components/shopping-list/normalization/QuantityConversionRule';
import { QuantityDescription } from '../../interfaces/Recipe';

export const QUANTITY_DESCRIPTION_NAME = 'test';
export const TEST_RULE_QUANTIFY_FACTOR = 100;
export const TEST_RULE_TO_UNIT_NAME = 'test-converted';

export const QUANTITY_DESCRIPTION_1: QuantityDescription = {
    quantityDescriptorId: 0,
    name: 'test',
    translations: {
        nl: 'test-nl'
    }
};

export const QUANTITY_DESCRIPTION_2: QuantityDescription = {
    quantityDescriptorId: 1,
    name: 'gram',
    translations: {
        nl: 'gram-nl'
    }
};

export const TEST_INGREDIENT_RULE = new QuantityConversionRule(QUANTITY_DESCRIPTION_1, QUANTITY_DESCRIPTION_2, TEST_RULE_QUANTIFY_FACTOR);