import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { connect } from 'react-redux';
import { Localisation } from '../../localisation/AppTexts';
import { Paths } from '../../Paths';
import { ReduxModel } from '../../redux/Store';
import MainMenuButton from "../common/ActionButton";

interface ReduxProps {
    loggedIn: boolean;
}

function mapStateToProps(reduxStore: ReduxModel): ReduxProps {
    return {
        loggedIn: reduxStore.user.loggedIn
    }
}

function ShoppingListMenuButton(props: ReduxProps) {
    if (!props.loggedIn) {
        return <></>
    }

    return <MainMenuButton linkTo={Paths.LIST} icon={faCarrot} label={Localisation.SHOPPING_LIST} />
}

export default connect(mapStateToProps)(ShoppingListMenuButton);