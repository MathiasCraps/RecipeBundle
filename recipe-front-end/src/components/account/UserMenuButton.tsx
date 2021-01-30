import { Tooltip } from "@chakra-ui/react";
import { faUserAlt, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { switchMenu } from "../../redux/Actions";
import { OpenedMenu, ReduxModel } from "../../redux/Store";
import { CSS_PRIMARY_BUTTON } from '../common/CssClassNames';

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

export function UserMenuButton(props: Props) {
    const classList = `user-account-button ${!props.loggedIn ? CSS_PRIMARY_BUTTON : ''}`
    return (<Tooltip label={Localisation.ACCOUNT_MANAGEMENT} fontSize="md">
    <a href="#" onClick={() => props.switchMenu(OpenedMenu.SESSION)} className={classList} aria-label={Localisation.ACCOUNT_MANAGEMENT}>
        <FontAwesomeIcon icon={props.loggedIn ? faUserAlt : faUserNinja} />
    </a></Tooltip>);
}

export default connect(mapStateToProps, { switchMenu })(UserMenuButton);