import { Tooltip } from "@chakra-ui/react";
import { faUserAlt, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { toggleLoginForm } from "../../redux/Actions";
import { ReduxModel } from "../../redux/Store";

interface OwnProps {
    loggedIn: boolean;
}

interface ReduxActionProps {
    toggleLoginForm: typeof toggleLoginForm;
}

type Props = OwnProps & ReduxActionProps;

function mapStateToProps(reduxStore: ReduxModel): OwnProps {
    return {
        loggedIn: reduxStore.user.loggedIn
    }
}

export function UserMenuButton(props: Props) {
    return (<Tooltip label={Localisation.ACCOUNT_MANAGEMENT} fontSize="md">
    <a href="#" onClick={() => props.toggleLoginForm()} className="user-account-button" aria-label={Localisation.ACCOUNT_MANAGEMENT}>
        <FontAwesomeIcon icon={props.loggedIn ? faUserAlt : faUserNinja} />
    </a></Tooltip>);
}

export default connect(mapStateToProps, { toggleLoginForm })(UserMenuButton);