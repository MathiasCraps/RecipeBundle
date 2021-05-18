import { faBox } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { ReduxModel } from "../../redux/Store";
import MainMenuButton from '../common/ActionButton';

interface OwnProps {
    loggedIn: boolean;
}

function mapStateToProps(store: ReduxModel): OwnProps {
    return {
        loggedIn: store.user.loggedIn
    }
}

function InventoryButton(props: OwnProps) {
    if (!props.loggedIn) {
        return <></>;
    }

    return <MainMenuButton linkTo={Paths.INVENTORY} 
        icon={faBox}
        label={Localisation.INVENTORY} />
}

export default connect(mapStateToProps)(InventoryButton);