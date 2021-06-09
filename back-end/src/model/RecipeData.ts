export interface StartData {
    categories: Category[];
    quantityDescriptions: QuantityDescription[];
}

export interface QuantityLessIngredient {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string | undefined;
    quantityDescription: QuantityDescription;
}

export interface LocalisedMap {
    [key: string]: string;
}

export interface Ingredient extends QuantityLessIngredient {
    quantity_number: number | null;
}

export interface Category {
    categoryId: number | undefined;
    categoryName: string;
    translations: LocalisedMap
}

export interface QuantityDescription {
    quantityDescriptorId: number | undefined;
    name: string;
    translations: LocalisedMap;
}

export interface Recipe {
    title: string;
    ingredients: Ingredient[];
    steps: string;
    image: string;
    id: number;
}

export interface DayMenu {
    date: number;
    menuId: number;
    recipeId: number;
    ingredientsBought: boolean;
}

export interface InventoryItem {
    ingredientId: number;
    quantity: number;
    desiredQuantity: number;
}