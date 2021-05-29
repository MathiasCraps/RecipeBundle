import { QuantifiedIngredient } from '../../../interfaces/Recipe';
import { AbstractQuantityConversionRule } from './AbstractQuantityConversionRule';

export class RulesHandler {
    constructor(private _rules: AbstractQuantityConversionRule[]) { }

    normalize(ingredients: QuantifiedIngredient[]) {
        return ingredients.map(this.doNormalizeIngredient);
    }

    private readonly doNormalizeIngredient = (ingredient: QuantifiedIngredient): QuantifiedIngredient => {
        for (const rule of this._rules) {
            if (rule.canHandle(ingredient)) {
                return rule.doHandle(ingredient);
            }
        }
        return ingredient;
    }
}