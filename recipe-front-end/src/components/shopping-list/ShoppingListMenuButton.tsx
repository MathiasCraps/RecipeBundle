import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { connect } from 'react-redux';
import { Localisation } from '../../localisation/AppTexts';
import { changeActiveView } from '../../redux/Actions';
import { ReduxModel, ViewType } from '../../redux/Store';
import MainMenuButton from "../common/ActionButton";

interface ReduxProps {
    loggedIn: boolean;
}

interface ReduxActions {
    changeActiveView: typeof changeActiveView;
}

function mapStateToProps(reduxStore: ReduxModel): ReduxProps {
    return {
        loggedIn: reduxStore.user.loggedIn
    }
}

type Props = ReduxProps & ReduxActions;

function ShoppingListMenuButton(props: Props) {
    if (!props.loggedIn) {
        return <></>
    }

    return <MainMenuButton icon={faCarrot} label={Localisation.SHOPPING_LIST} viewToOpen={ViewType.ShoppingList} />
}

export default connect(mapStateToProps, { changeActiveView })(ShoppingListMenuButton);