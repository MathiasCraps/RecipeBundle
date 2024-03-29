import { useMediaQuery } from '@chakra-ui/react';
import React from "react";
import { connect } from 'react-redux';
import { AppearAnimation } from '../../animations/AppearAnimation';
import { ReduxModel } from '../../redux/Store';
import UserMenuButton from '../account/UserMenuButton';
import MenuPlannerButton from '../menu-planner/MenuPlannerButton';
import AddRecipeMenuButton from '../recipe-management/AddRecipeMenuButton';
import ShoppingListMenuButton from '../shopping-list/ShoppingListMenuButton';
import HamburgerMain from './HamburgerMain';
import './ActionsContainer.scss';
import InventoryButton from '../inventory/InventoryButton';

interface ReduxProps {
    loggedIn: boolean;
    actionsOpened: boolean;
}

function mapStateToProps(reduxData: ReduxModel): ReduxProps {
    return {
        loggedIn: reduxData.user.loggedIn,
        actionsOpened: reduxData.mobileFabOpened
    }
}

function ActionsContainer(props: ReduxProps) {
    const [isBigScreen] = useMediaQuery("(min-width: 40em)");
    const showActions = !props.loggedIn || props.actionsOpened || isBigScreen;

    return <div className='actionsContainer'>
        {!isBigScreen && props.loggedIn && <HamburgerMain isOpened={props.actionsOpened} />}
        {showActions && <AppearAnimation>
            <div className='burger-more-options'>
                <AddRecipeMenuButton />
                <MenuPlannerButton />
                <InventoryButton />
                <ShoppingListMenuButton />
                <UserMenuButton />
            </div>
        </AppearAnimation>}
    </div>
}

export default connect(mapStateToProps, {})(ActionsContainer)