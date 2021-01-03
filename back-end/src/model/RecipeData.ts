export interface Ingredient {
    quantity: string;
    name: string;
}

export interface Recipe {
    title: string;
    ingredients: Ingredient[];
    steps: string;
    image: string;
}