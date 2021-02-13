import React from 'react';
import { useState } from 'react';
import { Ingredient } from '../../interfaces/Recipe';

interface props {
    ingredient: Ingredient;
}

export function ShoppingIngredient(props: props) {
    const ingredient = props.ingredient;
    const [isCancelled, setIsCancelled] = useState(false);
    if (!ingredient.quantity_number) {
        // no point in rendering this
        return <></>;
    }

    function handleKeyUp(event: React.KeyboardEvent) {
        switch (event.code) {
            case 'Enter':
            case 'Space':
                setIsCancelled(!isCancelled);
        }
    }

    return <li tabIndex={0} onKeyUp={handleKeyUp} className={`menu-recipe ${isCancelled ? 'strike-through grayed' : ''}`} onClick={() => setIsCancelled(!isCancelled)}>
        <strong>{ingredient.name}</strong> ({ingredient.quantity_number} {ingredient.quantity_description.toLowerCase()})
        </li>
}