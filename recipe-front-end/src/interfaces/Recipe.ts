export interface ApplicationData {
    menus: RawDayMenu[];
    recipes: Recipe[];
    categories: Category[];
    ingredients: QuantityLessIngredient[];
}

export interface QuantityLessIngredient {
    name: string;
    id: number;
    categoryId: number;
    categoryName: string;
}

export interface Ingredient extends QuantityLessIngredient {
    quantity_number: number | null;
    quantity_description: string;
}

export interface Recipe {
    title: string;
    ingredients: Ingredient[];
    steps: string;
    image: string;
    id: number;
}

export interface Category {
    categoryId: number;
    categoryName: string;
}

export interface RawDayMenu {
    date: number;
    menuId: number;
    recipeId: number;
    ingredientsBought: boolean;
}