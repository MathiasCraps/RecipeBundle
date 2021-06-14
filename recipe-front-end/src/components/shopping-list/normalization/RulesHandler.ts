import { QuantifiedIngredient } from '../../../interfaces/Recipe';
import { QuantityConversionRule } from './QuantityConversionRule';

export class RulesHandler {
    constructor(private _rules: QuantityConversionRule[]) { }

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