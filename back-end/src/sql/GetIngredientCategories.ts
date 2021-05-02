import { Pool } from 'pg';
import { Category, LocalizedCategory } from '../model/RecipeData';
import { executeQuery } from '../sql-utils/Database';

let cachedCategories: Category[] = [];
interface LocalisationLookupMap {
    [key: string]: LocalizedCategory;
}

export async function getIngredientCategories(pool: Pool): Promise<Category[]> {
    if (!cachedCategories.length || true) {
        const categories = (await executeQuery(pool, {
            name: 'get-all-ingredients',
            text: 'SELECT * from IngredientCategory',
            values: []
        })).rows;

        const categoriesLocalisation: LocalisationLookupMap = (await executeQuery(pool, {
            name: 'get-all-ingredient-translations',
            text: 'SELECT * from IngredientCategoryTranslation'
        })).rows.reduce((previous: LocalisationLookupMap, next) => {
            const categoryId = String(next.category_id);
            const languageCode = next.language_code;
            if (!previous[categoryId]) {
                previous[categoryId] = {};
            }

            previous[categoryId][languageCode] = next.localised_name;
            return previous;
        }, {});
    
        cachedCategories = categories.map((category) => {
            return {
                categoryId: category.id,
                categoryName: category.category_name,
                translations: categoriesLocalisation[category.id]
            }
        })
    }
    return cachedCategories;
}