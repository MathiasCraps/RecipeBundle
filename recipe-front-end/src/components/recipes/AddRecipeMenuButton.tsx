import { AddIcon } from "@chakra-ui/icons";
import { Box, Tooltip } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { ReduxModel } from "../../redux/Store";
import { toggleAddMenuForm } from "../../redux/Actions";
import { Localisation } from "../../localisation/AppTexts";

interface OwnProps {
    loggedIn: boolean;
}

interface ReduxActionProps {
    toggleAddMenuForm: typeof toggleAddMenuForm;
}

type Props = OwnProps & ReduxActionProps;

function mapStateToProps(reduxStore: ReduxModel): OwnProps {
    return {
        loggedIn: reduxStore.loggedIn
    }
}

function AddRecipeMenuButton(props: Props) {
    if (!props.loggedIn) {
        return <Box></Box>
    }

    return (<Tooltip label={Localisation.ADD_OWN_RECIPE} fontSize="md">
    <a href="#" onClick={() => props.toggleAddMenuForm()} className="user-add-recipe">
        <AddIcon size="xl" />
    </a></Tooltip>)
}

export default connect(mapStateToProps, { toggleAddMenuForm })(AddRecipeMenuButton);