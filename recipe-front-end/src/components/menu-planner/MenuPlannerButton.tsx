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

    return <div className='action-item'><Tooltip label={Localisation.MENU_PLANNER} fontSize="md">
        <a href="#" onClick={() => props.changeActiveView(ViewType.MenuPlanner, undefined)} className="plan-menu-btn">
            <FontAwesomeIcon icon={faCalendarWeek} />
        </a>
    </Tooltip></div>
}

export default connect(mapStateToProps, { changeActiveView })(MenuPlannerButton);