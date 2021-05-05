import { Ingredient } from '../../../interfaces/Recipe';

export function groupByCategory(ingredients: Ingredient[]): { [key: string]: Ingredient[] } {
    const ingredientsMap: {[key: string]: Ingredient[]} = {};
    for (const ingredient of ingredients) {
        const category = ingredient.category.categoryName;
        if (!ingredientsMap[category]) {
            ingredientsMap[category] = [];
        }

        ingredientsMap[category].push(ingredient);
    }
    return ingredientsMap;
}