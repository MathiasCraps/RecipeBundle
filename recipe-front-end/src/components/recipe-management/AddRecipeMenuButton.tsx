import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { changeActiveView } from "../../redux/Actions";
import { ReduxModel } from "../../redux/Store";
import MainMenuButton from "../common/ActionButton";

interface OwnProps {
    loggedIn: boolean;
}

interface ReduxProps {
    changeActiveView: typeof changeActiveView;
}

function mapStateToProps(reduxStore: ReduxModel): OwnProps {
    return {
        loggedIn: reduxStore.user.loggedIn
    }
}

type Props = OwnProps & ReduxProps;

function AddRecipeMenuButton(props: Props) {
    if (!props.loggedIn) {
        return <></>
    }

    return <MainMenuButton linkTo={Paths.ADD_RECIPE} label={Localisation.ADD_OWN_RECIPE} icon={faPlus} />}

export default connect(mapStateToProps, { changeActiveView })(AddRecipeMenuButton);