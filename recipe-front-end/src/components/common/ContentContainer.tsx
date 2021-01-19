import { Box, CloseButton, SlideFade } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { changeActiveView } from "../../redux/Actions";
import { ViewType } from "../../redux/Store";

interface OwnProps {
    children: React.ReactNode;
}

interface ReduxActions {
    changeActiveView: typeof changeActiveView;
}

type Props = OwnProps & ReduxActions;

function ContentContainer(props: Props) {
    return <Box>
        <CloseButton className="close-button-top-left" autoFocus={true} size="md" onClick={() => props.changeActiveView(ViewType.Overview, undefined)} />
        <SlideFade in={true}>
            <Box className="card-content" padding="2em" maxWidth="80em" margin="auto">
                {props.children}
            </Box>
        </SlideFade>
    </Box>
}

export default connect(null, { changeActiveView })(ContentContainer)