import { Pool } from 'pg';
import { QuantityDescription } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

export async function createQuantityDescriptions(pool: Pool, quantityDescriptions: QuantityDescription[]): Promise<void> {
    for (const quantityDescription of quantityDescriptions) {
        const categoryId = (await executeQuery(pool, {
            name: 'create-basic-quantity-description',
            text: 'INSERT INTO IngredientQuantityDescription (category_name) VALUES($1) RETURNING id',
            values: [quantityDescription.name]
        })).rows[0].id;

        const keys = Object.keys(quantityDescription.translations);
        for(let key of keys) {
            await executeQuery(pool, {
                name: 'create-quantity-description-localisation',
                text: 'INSERT INTO IngredientQuantityDescriptionTranslation (quantity_descriptor_id, language_code, localised_name) VALUES($1, $2, $3)',
                values: [categoryId, key.substr(0, 2), quantityDescription.translations[key]]
            });    
        }
    }
}