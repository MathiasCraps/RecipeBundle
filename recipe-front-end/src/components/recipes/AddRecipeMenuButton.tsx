import { AddIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { ReduxModel } from "../../redux/Store";
import { toggleAddMenuForm } from "../../redux/Actions";

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

    return (<a href="#" onClick={() => props.toggleAddMenuForm()} className="user-add-recipe">
        <AddIcon size="xl" />
    </a>)
}

export default connect(mapStateToProps, { toggleAddMenuForm })(AddRecipeMenuButton);