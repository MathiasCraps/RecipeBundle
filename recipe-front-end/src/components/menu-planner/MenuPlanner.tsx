import { Box, CloseButton, Heading, SlideFade } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { changeActiveView } from '../../redux/Actions';
import { ViewType } from "../../redux/Store";

interface Props {
    changeActiveView: typeof changeActiveView;
}

function MenuPlanner(props: Props) {
    return (<Box>
        <CloseButton className="close-button-top-left" autoFocus={true} size="md" onClick={() => props.changeActiveView(ViewType.Overview, undefined)} />
        <SlideFade in={true}>
            <Box className="week-planner-menu" padding="2em" maxWidth="80em">
                <Heading as="h2">{Localisation.MENU_PLANNER}</Heading>
            </Box>
        </SlideFade>
    </Box>)
}

export default connect(null, { changeActiveView })(MenuPlanner);