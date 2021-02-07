import { Ingredient } from '../../../interfaces/Recipe';

export abstract class AbstractQuantityConversionRule {
    abstract canHandle(ingredient: Ingredient): boolean;
    abstract doHandle(ingredient: Ingredient): Ingredient;
}