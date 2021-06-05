export interface ApplicationData {
    menus: RawDayMenu[];
    recipes: RawRecipe[];
    categories: Category[];
    ingredients: BaseIngredient[];
    inventories: RawInventoryItem[];
    quantityDescriptions: QuantityDescription[];
}

interface RawIngredient {
    id: number;
    name: string;
    categoryId: number;
    quantity_description_id: number;
}

export interface BaseIngredient extends RawIngredient {
    category: Category;
}

export interface QuantifiedIngredient extends BaseIngredient {
    quantity_number: number;
    quantity_description: string;
}

interface BaseRecipe<IngredientType> {
    title: string;
    steps: string;
    image: string;
    id: number;
    ingredients: IngredientType[];
}

export interface RawRecipe extends BaseRecipe<RawIngredient> {

}

export interface Recipe extends BaseRecipe<QuantifiedIngredient> {

}

export interface TranslationMap {
    [key: string]: string;
}

export interface Category {
    categoryId: number;
    categoryName: string;
    translations: TranslationMap;
}

export interface RawDayMenu {
    date: number;
    menuId: number;
    recipeId: number;
    ingredientsBought: boolean;
}

export interface RawInventoryItem {
    ingredientId: number;
    quantity: number;
    desiredQuantity: number;
}

export interface QuantityDescription {
    quantityDescriptorId: number;
    name: string;
    translation: TranslationMap;
}