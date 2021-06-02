import { Pool } from 'pg';
import { LocalisedMap, QuantityDescription } from '../../model/RecipeData';
import { executeQuery } from '../../sql-utils/Database';

let quantityDescriptions: QuantityDescription[] = [];
interface LocalisationLookupMap {
    [key: string]: LocalisedMap;
}

export async function getQuantityDescription(pool: Pool): Promise<QuantityDescription[]> {
    if (!quantityDescriptions.length || true) {
        const quantityDescriptionsRaw = (await executeQuery(pool, {
            name: 'get-all-quantity-descriptions-base',
            text: 'SELECT * from IngredientQuantityDescription',
            values: []
        })).rows;

        const quantityLocalisation: LocalisationLookupMap = (await executeQuery(pool, {
            name: 'get-all-quantity-descriptions-translations',
            text: 'SELECT * from IngredientQuantityDescriptionTranslation'
        })).rows.reduce((previous: LocalisationLookupMap, next) => {
            const identifier = String(next.quantity_descriptor_id);
            const languageCode = next.language_code;
            if (!previous[identifier]) {
                previous[identifier] = {};
            }

            previous[identifier][languageCode] = next.localised_name;
            return previous;
        }, {});
    
        quantityDescriptions = quantityDescriptionsRaw.map((quantityDescription) => {
            return {
                quantityDescriptorId: quantityDescription.id,
                name: quantityDescription.category_name,
                translations: quantityLocalisation[quantityDescription.id]
            }
        })
    }
    return quantityDescriptions;
}