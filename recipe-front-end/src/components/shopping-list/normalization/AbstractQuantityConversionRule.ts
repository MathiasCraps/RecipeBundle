import { QuantifiedIngredient, QuantityDescription } from '../../../interfaces/Recipe';

export class QuantityConversionRule {
    private fromUnit: QuantityDescription;
    private toUnit: QuantityDescription;

    private quantifyFactor: number;

    constructor(fromQuantityDescription: QuantityDescription, toQuantityDescription: QuantityDescription, quantityFactor: number) {
        this.fromUnit = fromQuantityDescription;
        this.toUnit = toQuantityDescription;
        this.quantifyFactor = quantityFactor;
    }

    canHandle(ingredient: QuantifiedIngredient): boolean {
        return this.fromUnit.quantityDescriptorId === ingredient.quantityDescription.quantityDescriptorId;
    }

    doHandle(ingredient: QuantifiedIngredient): QuantifiedIngredient {
        return {
            ...ingredient,
            quantityDescription: this.toUnit, // todo: fix later
            quantity_number: ingredient.quantity_number! * this.quantifyFactor
        };
    }
}