export interface ApplicationData {
    menus: DayMenu[];
    recipes: Recipe[];
}

export interface QuantityLessIngredient {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string | undefined;
}

export interface LocalizedCategory {
    [key: string]: string;
}

export interface Ingredient extends QuantityLessIngredient {
    quantity_number: number | null;
    quantity_description: string;
}

export interface Category {
    categoryId: number | undefined;
    categoryName: string;
    translations: LocalizedCategory
}

export interface TestData {
    categories: string[];
    recipes: Recipe[];
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