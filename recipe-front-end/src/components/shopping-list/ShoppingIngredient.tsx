import React from 'react';
import { useState } from 'react';
import { Ingredient } from '../../interfaces/Recipe';

interface props {
    ingredient: Ingredient;
}

export function ShoppingIngredient(props: props) {
    const ingredient = props.ingredient;
    const [isCanceled, setIsCancelled] = useState(false);
    if (!ingredient.quantity_number) {
            // no point in rendering this
            return <></>;
        } 

        return <li className={`menu-recipe ${isCanceled ? 'strike-through grayed' : ''}`} onClick={() => setIsCancelled(!isCanceled)}>
            <strong>{ingredient.name}</strong> ({ingredient.quantity_number} {ingredient.quantity_description.toLowerCase()})
        </li>
}