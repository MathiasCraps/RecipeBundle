import { Pool } from "pg";
import { Ingredient, QuantityLessIngredient, Recipe } from "../../model/RecipeData";
import { executeQuery } from '../../sql-utils/Database';
import { addIngredients } from '../ingredient/AddIngredients';
import { coupleExistingIngredients } from '../ingredient/CoupleExistingIngredients';
import { updateIngredients } from '../ingredient/EditIngredients';
import { getAllIngredients } from '../ingredient/GetIngredients';
import { getRecipeById } from './GetRecipeById';
import { removeIngredients } from '../ingredient/RemoveIngredients';

type ModifiedIngredientsMap = {
    addedAndNew: Ingredient[];
    addedNotNew: Ingredient[];
    edited: Ingredient[];
    removed: Ingredient[];
};

type OptimizedOriginalMap = {
    [key: string]: Ingredient;
}

type AllIngredientsLookupMap = {
    [key: string]: QuantityLessIngredient;
}

function ingredientIsModified(ingredientA: Ingredient, ingredientB: Ingredient): boolean {
    return Boolean(ingredientA.categoryName !== ingredientB.categoryName ||
        ingredientA.name !== ingredientB.name ||
        ingredientA.quantity_number !== ingredientB.quantity_number ||
        ingredientA.quantity_description !== ingredientB.quantity_description);
}

function compareIngredientChanges(
    sourceIngredients: Ingredient[],
    targetIngredients: Ingredient[],
    allIngredients: QuantityLessIngredient[]
): ModifiedIngredientsMap {
    const originalLookupMap: OptimizedOriginalMap = sourceIngredients.reduce<OptimizedOriginalMap>(
        (previous: OptimizedOriginalMap, next: Ingredient) => {
            previous[next.id] = next;
            return previous;
        }, {}
    );

    const existingIngredientsMap: AllIngredientsLookupMap = allIngredients.reduce(
        (previous: AllIngredientsLookupMap, next: QuantityLessIngredient) => {
            previous[next.name.toLowerCase()] = next;
            return previous;
        }, {});

    const modificationMap = targetIngredients.reduce<ModifiedIngredientsMap>((previous: ModifiedIngredientsMap, ingredient: Ingredient) => {
        const comparisonEntry = originalLookupMap[ingredient.id]

        if (!comparisonEntry) {
            if (existingIngredientsMap[ingredient.name.toLowerCase()]) {
                previous.addedNotNew.push(ingredient)
            } else {
                previous.addedAndNew.push(ingredient);
            }
            return previous;
        }

        if (ingredientIsModified(comparisonEntry, ingredient)) {
            previous.edited.push(ingredient);
        }

        // entry considered, nullify
        delete originalLookupMap[ingredient.id];

        return previous;
    }, { addedAndNew: [], addedNotNew: [], edited: [], removed: [] });

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
        targetRecipe.ingredients,
        allIngredients
    );

    await addIngredients(pool, modifiedIngredients.addedAndNew, sourceRecipe.id);
    await coupleExistingIngredients(pool, modifiedIngredients.addedNotNew, sourceRecipe.id);

    await updateIngredients(pool, modifiedIngredients.edited, sourceRecipe.id);
    await removeIngredients(pool, modifiedIngredients.removed, sourceRecipe.id);

    return sourceRecipe.image.replace(`${process.env.DOMAIN}/`, '');
}
