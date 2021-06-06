import { QuantifiedIngredient } from '../../../interfaces/Recipe';

export abstract class AbstractQuantityConversionRule {
    protected abstract toUnit: string;
    protected abstract quantifyFactor: number;

    abstract canHandle(ingredient: QuantifiedIngredient): boolean;
    doHandle(ingredient: QuantifiedIngredient): QuantifiedIngredient {
        return {
            ...ingredient,
            quantityDescription: this.toUnit, // todo: fix later
            quantity_number: ingredient.quantity_number! * this.quantifyFactor
        };
    }
}