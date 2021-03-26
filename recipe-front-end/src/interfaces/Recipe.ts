export interface ApplicationData {
    menus: RawDayMenu[];
    recipes: Recipe[];
}

export interface Ingredient {
    name: string;
    quantity_number: number | null;
    quantity_description: string;
}

export interface Recipe {
    title: string;
    ingredients: Ingredient[];
    steps: string;
    image: string;
    id: number;
    categoryName: string;
}

export interface RawDayMenu {
    date: number;
    menuId: number;
    recipeId: number;
    ingredientsBought: boolean;
}