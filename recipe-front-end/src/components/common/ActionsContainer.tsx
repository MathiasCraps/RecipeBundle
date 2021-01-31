import { useMediaQuery } from '@chakra-ui/react';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import { connect } from 'react-redux';
import UserMenuButton from '../account/UserMenuButton';
import MenuPlannerButton from '../menu-planner/MenuPlannerButton';
import AddRecipeMenuButton from '../recipe-management/AddRecipeMenuButton';
import { CSS_PRIMARY_BUTTON } from './CssClassNames';

interface ReduxProps {
    isOpened: boolean;
}

function mapStateToProps(): ReduxProps {
    return {
        isOpened: true
    }
}

function ActionsContainer(props: ReduxProps) {
    const [isBigScreen] = useMediaQuery("(min-width: 40em)");
    const [isOpened, setIsOpened] = useState(false)

    return <div className='actionsContainer'>
        {(isOpened || isBigScreen) && <div className='burger-more-options'>
            <UserMenuButton />
            <MenuPlannerButton />
            <AddRecipeMenuButton />
        </div>}
        
        {!isBigScreen &&<div className='action-item'>
            <a className={CSS_PRIMARY_BUTTON}
                href='#'
                onClick={() => setIsOpened(!isOpened)}>
                <FontAwesomeIcon icon={isOpened ? faTimes : faBars} />
            </a>
        </div>}
    </div>
}

export default connect(mapStateToProps, {})(ActionsContainer)