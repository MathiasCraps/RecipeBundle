export interface ApplicationData {
    menus: RawDayMenu[];
    recipes: Recipe[];
    categories: Category[];
}

export interface Ingredient {
    name: string;
    id: number;
    quantity_number: number | null;
    quantity_description: string;
    categoryId: number;
    categoryName: string;
}

export interface Recipe {
    title: string;
    ingredients: Ingredient[];
    steps: string;
    image: string;
    id: number;
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