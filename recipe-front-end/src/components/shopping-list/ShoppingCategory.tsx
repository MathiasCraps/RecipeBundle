import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Ingredient } from '../../interfaces/Recipe';
import { translateCategory } from '../../localisation/CategoryLocalisation';
import { ShoppingIngredient } from './ShoppingIngredient';
import './ShoppingCategory.scss';

interface OwnProps {
    ingredients: Ingredient[];
}

export function ShoppingCategory(props: OwnProps) {
    const [isOpened, setIsOpened] = useState<boolean>(true);
    const display = isOpened ? 'block': 'none';

    return <div className="clearer category">
        <h3 onClick={() => setIsOpened(!isOpened)}>
            <FontAwesomeIcon className="display-icon" icon={isOpened ? faCaretDown : faCaretRight } />
            {translateCategory(props.ingredients[0].categoryName as any)}</h3>
        <ul style={{ display }}>
            {props.ingredients.sort((a, b) => a.name > b.name ? 1 : -1)
                .map((ingredient, index) => <React.Fragment key={index}>
                    <ShoppingIngredient ingredient={ingredient} /></React.Fragment>)}
        </ul>
    </div>
}
