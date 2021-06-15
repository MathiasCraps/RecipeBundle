import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { QuantifiedIngredient } from '../../interfaces/Recipe';
import './ShoppingCategory.scss';
import { ShoppingIngredient } from './ShoppingIngredient';

interface OwnProps {
    ingredients: QuantifiedIngredient[];
}

export function ShoppingCategory(props: OwnProps) {
    const [isOpened, setIsOpened] = useState<boolean>(true);
    const display = isOpened ? 'block' : 'none';

    return <div className={`clearer category ${isOpened ? 'opened' : 'closed'}`}>
        <h3>
            <button onClick={() => setIsOpened(!isOpened)}>
                <FontAwesomeIcon className="display-icon" icon={isOpened ? faCaretDown : faCaretRight} />
                {props.ingredients[0].category.translations.nl}
            </button>
        </h3>
        <ul className="category-list" style={{ display }}>
            {props.ingredients.sort((a, b) => a.name > b.name ? 1 : -1)
                .map((ingredient, index) => <React.Fragment key={index}>
                    <ShoppingIngredient ingredient={ingredient} /></React.Fragment>)}
        </ul>
    </div>
}
