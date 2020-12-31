import { faUserAlt, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
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
        loggedIn: reduxStore.loggedIn
    }
}

export function UserMenuButton(props: Props) {
    return (<a href="#" onClick={() => props.toggleLoginForm()} className="user-account-button" aria-label="Account beheren">
        <FontAwesomeIcon icon={props.loggedIn ? faUserAlt : faUserNinja} />
    </a>);
}

export default connect(mapStateToProps, { toggleLoginForm })(UserMenuButton);