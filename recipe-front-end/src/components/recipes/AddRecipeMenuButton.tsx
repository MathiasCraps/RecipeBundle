import { AddIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { ReduxModel } from "../../redux/Store";

interface OwnProps {
    loggedIn: boolean;
}

interface ReduxActionProps {
    toDo?(): void;
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

    return (<a href="#" onClick={() => console.log('clicked')} className="user-add-recipe">
        <AddIcon size="xl" />
    </a>)
}

export default connect(mapStateToProps, {})(AddRecipeMenuButton);