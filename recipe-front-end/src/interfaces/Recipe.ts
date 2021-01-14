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
}