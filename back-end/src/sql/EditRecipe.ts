import { Pool } from "pg";
import { Ingredient, Recipe } from "../model/RecipeData";
import { executeQuery } from '../sql-utils/Database';
import { addIngredients } from './AddIngredients';
import { updateIngredients } from './EditIngredients';
import { getAllIngredients } from './GetIngredients';
import { getRecipeById } from './GetRecipeById';
import { removeIngredients } from './RemoveIngredients';

type ModifiedIngredientsMap = {
    added: Ingredient[];
    edited: Ingredient[];
    removed: Ingredient[];
};

type OptimizedOriginalMap = {
    [key: string]: Ingredient;
}

function ingredientIsModified(ingredientA: Ingredient, ingredientB: Ingredient): boolean {
    return Boolean(ingredientA.categoryName !== ingredientB.categoryName ||
        ingredientA.name !== ingredientB.name ||
        ingredientA.quantity_number !== ingredientB.quantity_number ||
        ingredientA.quantity_description !== ingredientB.quantity_description);
}

function compareIngredientChanges(
    sourceIngredients: Ingredient[],
    targetIngredients: Ingredient[]
): ModifiedIngredientsMap {
    const originalLookupMap: OptimizedOriginalMap = sourceIngredients.reduce<OptimizedOriginalMap>(
        (previous: OptimizedOriginalMap, next: Ingredient) => {
            previous[next.id] = next;
            return previous;
        }, {}
    );

    const modificationMap = targetIngredients.reduce<ModifiedIngredientsMap>((previous: ModifiedIngredientsMap, ingredient: Ingredient) => {
        const comparisonEntry = originalLookupMap[ingredient.id]

        if (!comparisonEntry) {
            previous.added.push(ingredient);
            return previous;
        }

        if (ingredientIsModified(comparisonEntry, ingredient)) {
            previous.edited.push(ingredient);
        }

        // entry considered, nullify
        delete originalLookupMap[ingredient.id];

        return previous;
    }, { added: [], edited: [], removed: [] });

    const remainingKeys = Object.keys(originalLookupMap);

    for (let key of remainingKeys) {
        modificationMap.removed.push(originalLookupMap[key])
    }

    return modificationMap;
}

export async function editRecipe(pool: Pool, targetRecipe: Recipe): Promise<string> {
    const sourceRecipe = await getRecipeById(pool, targetRecipe.id);
    const allIngredients = await getAllIngredients(pool);

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
    await removeIngredients(pool, modifiedIngredients.removed, sourceRecipe.id);

    return sourceRecipe.image.replace(`${process.env.DOMAIN}/`, '');
}
