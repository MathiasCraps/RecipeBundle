import React from 'react';
import { Ingredient } from '../../interfaces/Recipe';
import { translateCategory } from '../../localisation/CategoryLocalisation';
import { ShoppingIngredient } from './ShoppingIngredient';

interface OwnProps {
    ingredients: Ingredient[];
}

export function ShoppingCategory(props: OwnProps) {
    return <div className="clearer">
        <h3>{translateCategory(props.ingredients[0].categoryName as any)}</h3>
        <ul>
            {props.ingredients.sort((a, b) => a.name > b.name ? 1 : -1)
                .map((ingredient, index) => <React.Fragment key={index}>
                    <ShoppingIngredient ingredient={ingredient} /></React.Fragment>)}
        </ul></div>
}