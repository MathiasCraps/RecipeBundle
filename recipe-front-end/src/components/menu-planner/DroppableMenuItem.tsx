import { Tooltip } from '@chakra-ui/react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Localisation } from '../../localisation/AppTexts';
import { removeMenu, toggleMenuIngredientsBought, toggleMenuIngredientsBoughtReturn } from '../../redux/Actions';
import { DayMenu, RemoveMenuAction, ToggleMenuIngredientsBoughtAction } from "../../redux/Store";
import './DroppableMenuItem.scss';

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
        <div>
            {props.menu.recipe.title}
            <Tooltip label={Localisation.REMOVE}>
                <a className="remove-menu" href="#" onClick={() => props.removeMenu(props.menu)}>
                    <FontAwesomeIcon icon={faTrash} />
                </a>
            </Tooltip>
        </div>


        <div>
            <label tabIndex={0} onClick={() => props.toggleMenuIngredientsBought([props.menu], !props.menu.ingredientsBought)}>
                <input type="checkbox" checked={props.menu.ingredientsBought} />
                <span className={props.menu.ingredientsBought ? "ingredients-bought" : ""}>
                    {props.menu.ingredientsBought ? Localisation.YOU_HAVE_ALL_INGREDIENTS : Localisation.YOU_DONT_HAVE_ALL_INGREDIENTS}
                </span>
            </label>
        </div>
    </div>)
}

export default connect(null, mapDispatchToProps)(DroppableMenuItem);