import { faUserAlt, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { switchMenu } from "../../redux/Actions";
import { OpenedMenu, ReduxModel } from "../../redux/Store";
import HashButton from '../common/HashButton';

interface ReduxProps {
    loggedIn: boolean;
}

function mapStateToProps(reduxStore: ReduxModel): ReduxProps {
    return {
        loggedIn: reduxStore.user.loggedIn
    }
}

export function UserMenuButton(props: ReduxProps) {
    const icon = props.loggedIn ? faUserAlt : faUserNinja;
    return <HashButton menuToOpen={OpenedMenu.SESSION} label={Localisation.ACCOUNT_MANAGEMENT} icon={icon}  />;
}

export default connect(mapStateToProps, { switchMenu })(UserMenuButton);