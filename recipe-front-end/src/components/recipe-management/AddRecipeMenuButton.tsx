import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { ReduxModel } from "../../redux/Store";
import MainMenuButton from "../common/ActionButton";

interface OwnProps {
    loggedIn: boolean;
}

function mapStateToProps(reduxStore: ReduxModel): OwnProps {
    return {
        loggedIn: reduxStore.user.loggedIn
    }
}

function AddRecipeMenuButton(props: OwnProps) {
    if (!props.loggedIn) {
        return <></>
    }

    return <MainMenuButton linkTo={Paths.ADD_RECIPE} label={Localisation.ADD_OWN_RECIPE} icon={faPlus} />}

export default connect(mapStateToProps)(AddRecipeMenuButton);