import { Tooltip } from "@chakra-ui/react";
import { faUserAlt, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { switchMenu } from "../../redux/Actions";
import { OpenedMenu, ReduxModel } from "../../redux/Store";

interface OwnProps {
    loggedIn: boolean;
}

interface ReduxActionProps {
    switchMenu: typeof switchMenu;
}

type Props = OwnProps & ReduxActionProps;

function mapStateToProps(reduxStore: ReduxModel): OwnProps {
    return {
        loggedIn: reduxStore.user.loggedIn
    }
}

/*

    <Tooltip label={Localisation.MENU_PLANNER} fontSize="md">
        <button className='action-item' onClick={() => props.changeActiveView(ViewType.MenuPlanner, undefined)} >
            <FontAwesomeIcon className="plan-menu-btn" icon={faCalendarWeek} />
        </button>
    </Tooltip>

*/

export function UserMenuButton(props: Props) {
    return <Tooltip label={Localisation.ACCOUNT_MANAGEMENT} fontSize="md">
        <button className='action-item'
            onClick={() => props.switchMenu(OpenedMenu.SESSION)}
            aria-label={Localisation.ACCOUNT_MANAGEMENT}>
            <FontAwesomeIcon icon={props.loggedIn ? faUserAlt : faUserNinja} />
        </button>
    </Tooltip>;
}

export default connect(mapStateToProps, { switchMenu })(UserMenuButton);