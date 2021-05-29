import { QuantifiedIngredient } from '../../../../interfaces/Recipe';
import { AbstractQuantityConversionRule } from '../AbstractQuantityConversionRule';

export class TeaSpoonToGramRule extends AbstractQuantityConversionRule {
    protected toUnit = 'gram';
    protected quantifyFactor = 3;

    canHandle(ingredient: QuantifiedIngredient): boolean {
        return ingredient.quantity_description === 'theelepel'
    }
}