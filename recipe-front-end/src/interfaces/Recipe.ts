export interface ApplicationData {
    menus: RawDayMenu[];
    recipes: RawRecipe[];
    categories: Category[];
    ingredients: BaseIngredient;
}

export interface BaseIngredient {
    id: number;
    name: string;
    categoryId: number;
}

export interface QuantifiedIngredient extends BaseIngredient {
    quantity_number: number;
    quantity_description: string;
}

export interface Ingredient extends QuantifiedIngredient {
    category: Category;
}

interface BaseRecipe<IngredientType> {
    title: string;
    steps: string;
    image: string;
    id: number;
    ingredients: IngredientType[];
}

export interface RawRecipe extends BaseRecipe<QuantifiedIngredient> {

}

export interface Recipe extends BaseRecipe<Ingredient> {

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