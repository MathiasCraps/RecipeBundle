export interface ApplicationData {
    menus: DayMenu[];
    recipes: Recipe[];
}

export interface Ingredient {
    id: number;
    name: string;
    quantity_number: number | null;
    quantity_description: string;
    categoryId: number;
    categoryName: string | undefined;
}

export interface Category {
    categoryId: number;
    categoryName: string;
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