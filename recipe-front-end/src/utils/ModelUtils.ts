import { BaseIngredient, Category, QuantityDescription, RawIngredient } from '../interfaces/Recipe';
import { convertArrayToLinkedMap } from './ArrayUtils';

export function rawToBaseIngredient(rawIngredient: RawIngredient, categories: Category[], quantityDescriptions: QuantityDescription[]): BaseIngredient {
    const linkedMapCategories = convertArrayToLinkedMap(categories, 'categoryId');
    const linkedMapQuantityDescription = convertArrayToLinkedMap(quantityDescriptions, 'quantityDescriptorId');

    return {
        ...rawIngredient,
        category: linkedMapCategories[rawIngredient.categoryId],
        quantityDescription: linkedMapQuantityDescription[rawIngredient.quantity_description_id]
    }
}
