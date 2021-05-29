import { QuantifiedIngredient } from '../../../../interfaces/Recipe';
import { AbstractQuantityConversionRule } from '../AbstractQuantityConversionRule';

export class TableSpoonToGramRule extends AbstractQuantityConversionRule {
    protected toUnit = 'gram';
    protected quantifyFactor = 15;

    canHandle(ingredient: QuantifiedIngredient): boolean {
        return (ingredient.quantity_description === 'eetlepel'
            || ingredient.quantity_description === 'eetlepels');
    }
}