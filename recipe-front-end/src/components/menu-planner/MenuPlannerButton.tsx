import { Tooltip } from "@chakra-ui/react";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
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

function mapStateToProps(store: ReduxModel): OwnProps {
    return {
        loggedIn: store.user.loggedIn
    }
}

type Props = OwnProps & ReduxProps;

function MenuPlannerButton(props: Props) {
    if (!props.loggedIn) {
        return <span></span>;
    }

    return <Tooltip label={Localisation.MENU_PLANNER} fontSize="md">
        <button className='action-item'
            onClick={() => props.changeActiveView(ViewType.MenuPlanner, undefined)}
            aria-label={Localisation.MENU_PLANNER}>
            <FontAwesomeIcon icon={faCalendarWeek} />
        </button>
    </Tooltip>
}

export default connect(mapStateToProps, { changeActiveView })(MenuPlannerButton);