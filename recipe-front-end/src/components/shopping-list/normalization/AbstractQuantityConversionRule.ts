import { Ingredient } from '../../../interfaces/Recipe';

export abstract class AbstractQuantityConversionRule {
    protected abstract toUnit: string;
    protected abstract quantifyFactor: number;

    abstract canHandle(ingredient: Ingredient): boolean;
    doHandle(ingredient: Ingredient): Ingredient {
        return {
            ...ingredient,
            quantity_description: this.toUnit,
            quantity_number: ingredient.quantity_number! * this.quantifyFactor
        };
    }
}