import { Ingredient } from '../../../interfaces/Recipe';
import { AbstractQuantityConversionRule } from './AbstractQuantityConversionRule';

export class RulesHandler {
    constructor(private _rules: AbstractQuantityConversionRule[]) { }

    normalize(ingredients: Ingredient[]) {
        return ingredients.map(this.doNormalizeIngredient);
    }

    private doNormalizeIngredient(ingredient: Ingredient): Ingredient {
        for (const rule of this._rules) {
            if (rule.canHandle(ingredient)) {
                return rule.doHandle(ingredient);
            }
        }
        return ingredient;
    }
}