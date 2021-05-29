import { QuantifiedIngredient } from '../../../interfaces/Recipe';
import { RulesHandler } from './RulesHandler';
import { SortedRecipeMap } from './SortRecipeMap';

export function combineToSingleValue(sortedRecipeMap: SortedRecipeMap, rulesHandler: RulesHandler): QuantifiedIngredient[] {
    const keys = Object.keys(sortedRecipeMap);
    return keys.map((key) => {
        const recipeMap: QuantifiedIngredient[] = sortedRecipeMap[key];
        const ingredients = rulesHandler.normalize(recipeMap);
        return {
            name: key.toLowerCase(),
            quantity_number: ingredients.reduce((previous, current) => {
                return previous + current.quantity_number!;
            }, 0),
            quantity_description: ingredients[0].quantity_description,
            categoryId: ingredients[0].categoryId,
            id: ingredients[0].id,
            category: ingredients[0].category
        }
    })
}