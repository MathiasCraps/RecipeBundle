import { Tooltip } from "@chakra-ui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { changeActiveView } from "../../redux/Actions";
import { ReduxModel, ViewType } from "../../redux/Store";

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

    return <Tooltip label={Localisation.ADD_OWN_RECIPE} fontSize="md">
        <button className='action-item'
            onClick={() => props.changeActiveView(ViewType.AddRecipe, undefined)}
            aria-label={Localisation.ADD_OWN_RECIPE}>
            <FontAwesomeIcon icon={faPlus} />
        </button>
    </Tooltip>
}

export default connect(mapStateToProps, { changeActiveView })(AddRecipeMenuButton);