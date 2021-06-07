import React, { useState } from 'react';
import { QuantifiedIngredient } from '../../interfaces/Recipe';
import './ShoppingIngredient.scss';

interface props {
    ingredient: QuantifiedIngredient;
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
                break;
            default:
            // ignore
        }
    }

    return <li tabIndex={0}
        onKeyUp={handleKeyUp}
        className={`menu-recipe ${isCancelled ? 'strike-through grayed' : ''}`}
        onClick={() => setIsCancelled(!isCancelled)}>
        <strong>{ingredient.name}</strong> ({ingredient.quantity_number} {ingredient.quantityDescription.translation['nl'].toLowerCase()})
    </li>
}