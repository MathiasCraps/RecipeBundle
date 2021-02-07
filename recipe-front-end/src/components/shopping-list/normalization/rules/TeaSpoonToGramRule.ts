import { Ingredient } from '../../../../interfaces/Recipe';
import { AbstractQuantityConversionRule } from '../AbstractQuantityConversionRule';

export class TableSpoonToGram extends AbstractQuantityConversionRule {
    protected toUnit = 'gram';
    protected quantifyFactor = 15;

    canHandle(ingredient: Ingredient): boolean {
        return ingredient.quantity_description === 'theelepel'
    }
}