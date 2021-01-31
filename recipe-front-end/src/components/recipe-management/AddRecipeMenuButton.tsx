import { Tooltip } from "@chakra-ui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { changeActiveView } from "../../redux/Actions";
import { ReduxModel, ViewType } from "../../redux/Store";
import { CSS_PRIMARY_BUTTON } from '../common/CssClassNames';

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
        return <span></span>
    }

    return <div className='action-item'><Tooltip label={Localisation.ADD_OWN_RECIPE} fontSize="md">
        <a href="#" onClick={() => props.changeActiveView(ViewType.AddRecipe, undefined)} className="user-add-recipe">
            <FontAwesomeIcon icon={faPlus} />
        </a></Tooltip></div>
}

export default connect(mapStateToProps, { changeActiveView })(AddRecipeMenuButton);