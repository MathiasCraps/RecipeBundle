export interface ApplicationData {
    menus: DayMenu[];
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
}

export interface DayMenu {
    date: number;
    recipeId: number;
}