import { Ingredient } from '../../../../interfaces/Recipe';
import { AbstractQuantityConversionRule } from '../AbstractQuantityConversionRule';

export class TableSpoonToGramRule extends AbstractQuantityConversionRule {

    canHandle(ingredient: Ingredient): boolean {
       return (ingredient.quantity_description === 'eetlepel' || ingredient.quantity_description === 'eetlepels');
    }
    
    doHandle(ingredient: Ingredient): Ingredient {
        return {
            ...ingredient,
            quantity_description: 'gram',
            quantity_number: ingredient.quantity_number! * 15
        };
    }
}