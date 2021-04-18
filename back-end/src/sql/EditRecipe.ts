import { Pool } from "pg";
import { Ingredient, Recipe } from "../model/RecipeData";
import { executeQuery } from '../sql-utils/Database';
import { addIngredients } from './AddIngredients';
import { updateIngredients } from './EditIngredients';
import { getRecipeById } from './GetRecipeById';

type ModifiedIngredientsMap = {
    added: Ingredient[];
    edited: Ingredient[];
};

type OptimizedOriginalMap = {
    [key: number]: Ingredient;
}

function ingredientIsModified(ingredientA: Ingredient, ingredientB: Ingredient): boolean {
    return Boolean(ingredientA.categoryName !== ingredientB.categoryName ||
        ingredientA.name !== ingredientB.name ||
        ingredientA.quantity_number !== ingredientB.quantity_number ||
        ingredientA.quantity_description !== ingredientB.quantity_description);
}

function compareIngredientChanges(sourceIngredients: Ingredient[], targetIngredients: Ingredient[]): ModifiedIngredientsMap {
    const originalLookupMap: OptimizedOriginalMap = sourceIngredients.reduce<OptimizedOriginalMap>(
        (previous: OptimizedOriginalMap, next: Ingredient) => {
            previous[next.id] = next;
            return previous;
        }, {}
    );

    // todo: detect removals
    return targetIngredients.reduce<ModifiedIngredientsMap>((previous: ModifiedIngredientsMap, ingredient: Ingredient) => {
        const comparisonEntry = originalLookupMap[ingredient.id]

        if (!comparisonEntry) {
            previous.added.push(ingredient);
            return previous;
        }


        if (ingredientIsModified(comparisonEntry, ingredient)) {
            previous.edited.push(ingredient);
        }

        return previous;
    }, { added: [], edited: [] });

}

export async function editRecipe(pool: Pool, targetRecipe: Recipe): Promise<string> {
    const sourceRecipe = await getRecipeById(pool, targetRecipe.id);

    if (!sourceRecipe) {
        throw new Error('Original recipe does not exist.');
    }

    if (sourceRecipe.title !== targetRecipe.title || sourceRecipe.steps !== targetRecipe.steps) {
        executeQuery(pool, {
            name: 'update-recipe-base',
            text: `UPDATE Recipes SET recipe_name = $1, steps = $2 WHERE id = $3`,
            values: [
                targetRecipe.title,
                targetRecipe.steps,
                targetRecipe.id
            ]
        });
    }

    const modifiedIngredients = compareIngredientChanges(
        sourceRecipe.ingredients,
        targetRecipe.ingredients
    );

    await addIngredients(pool, modifiedIngredients.added, sourceRecipe.id);
    await updateIngredients(pool, modifiedIngredients.edited, sourceRecipe.id);

    return sourceRecipe.image;
}