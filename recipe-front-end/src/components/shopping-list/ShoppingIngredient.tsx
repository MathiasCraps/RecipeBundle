import { Ingredient } from '../../interfaces/Recipe';

interface props {
    ingredient: Ingredient;
}

export function ShoppingIngredient(props: props) {
    const ingredient = props.ingredient;
    if (!ingredient.quantity_number) {
            // no point in rendering this
            return <></>;
        } 

        return <>
            <strong>{ingredient.name}</strong> 
            ({ingredient.quantity_number} {ingredient.quantity_description.toLowerCase()})
        </>
}