import { useMediaQuery } from '@chakra-ui/react';
import React from "react";
import { connect } from 'react-redux';
import { ReduxModel } from '../../redux/Store';
import UserMenuButton from '../account/UserMenuButton';
import MenuPlannerButton from '../menu-planner/MenuPlannerButton';
import AddRecipeMenuButton from '../recipe-management/AddRecipeMenuButton';
import HamburgerMain from './HamburgerMain';

interface ReduxProps {
    extraActionsVisible: boolean;
}

function mapStateToProps(reduxData: ReduxModel): ReduxProps {
    return {
        extraActionsVisible: reduxData.mobileFabOpened
    }
}

function ActionsContainer(props: ReduxProps) {
    const [isBigScreen] = useMediaQuery("(min-width: 40em)");

    return <div className='actionsContainer'>
        {(props.extraActionsVisible || isBigScreen) && <div className='burger-more-options'>
            <UserMenuButton />
            <MenuPlannerButton />
            <AddRecipeMenuButton />
        </div>}
        
        {!isBigScreen && <HamburgerMain isOpened={props.extraActionsVisible}/>}
    </div>
}

export default connect(mapStateToProps, {})(ActionsContainer)