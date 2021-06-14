import { QuantifiedIngredient } from '../../../interfaces/Recipe';

export function groupByCategory(ingredients: QuantifiedIngredient[]): { [key: string]: QuantifiedIngredient[] } {
    const ingredientsMap: {[key: string]: QuantifiedIngredient[]} = {};
    for (const ingredient of ingredients) {
        const category = ingredient.category.categoryName;
        if (!ingredientsMap[category]) {
            ingredientsMap[category] = [];
        }

        ingredientsMap[category].push(ingredient);
    }
    return ingredientsMap;
}