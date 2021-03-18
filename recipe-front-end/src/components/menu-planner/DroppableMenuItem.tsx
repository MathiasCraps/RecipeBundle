import { Tooltip } from '@chakra-ui/react';
import { faTrash, faCheckSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Localisation } from '../../localisation/AppTexts';
import { toggleMenuIngredientsBoughtReturn, removeMenu, toggleMenuIngredientsBought } from '../../redux/Actions';
import { DayMenu, RemoveMenuAction, ToggleMenuIngredientsBoughtAction } from "../../redux/Store";
import DayDetails from './DayDetails';

interface OwnProps {
    menu: DayMenu;
}

interface ReduxActions {
    removeMenu: (menu: DayMenu) => void;
    toggleMenuIngredientsBought: toggleMenuIngredientsBoughtReturn;
}


function mapDispatchToProps(dispatch: Dispatch<RemoveMenuAction | ToggleMenuIngredientsBoughtAction>): ReduxActions {
    return {
        removeMenu: removeMenu(dispatch),
        toggleMenuIngredientsBought: toggleMenuIngredientsBought(dispatch)
    }
}

type Props = OwnProps & ReduxActions;

function DroppableMenuItem(props: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const extraClasses = isDragging ? 'is-dragging' : ''

    return (<div className={`day-menu-item ${extraClasses}`}
        draggable
        onDragStart={(event) => {
            setIsDragging(true);
            event.dataTransfer.setData('menuId', String(props.menu.menuId))
        }}
        onDragEnd={() => setIsDragging(false)}>
        {props.menu.recipe.title}
        <Tooltip label={Localisation.REMOVE}>
            <a href="#" onClick={() => props.removeMenu(props.menu)}>
                <FontAwesomeIcon icon={faTrash} />
            </a>
        </Tooltip>
        <Tooltip label={props.menu.ingredientsBought ?
            Localisation.YOU_HAVE_ALL_INGREDIENTS :
            Localisation.YOU_DONT_HAVE_ALL_INGREDIENTS
        }>
            <a href="#" onClick={() => props.toggleMenuIngredientsBought([props.menu], !props.menu.ingredientsBought)}>
                <FontAwesomeIcon icon={props.menu.ingredientsBought ? faCheckSquare : faTimes} />
            </a>
        </Tooltip>
    </div>)
}

export default connect(null, mapDispatchToProps)(DroppableMenuItem);