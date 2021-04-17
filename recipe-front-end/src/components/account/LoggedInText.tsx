import { Box } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Localisation } from "../../localisation/AppTexts";
import { doLogOut } from "../../redux/Actions";
import { LogoutAction } from "../../redux/Store";

interface Props {
    doLogOut: () => void;
}

function mapDispatchToProps(dispatch: Dispatch<LogoutAction>): Props {
    return {
        doLogOut: doLogOut(dispatch)
    }
}

function LoggedInText(props: Props) {
    return (<Box>
        {Localisation.LOGGED_IN_ENCOURAGING}
        <p><button onClick={() => props.doLogOut()}>{Localisation.LOG_OUT}</button></p>
    </Box>)
}

export default connect(null, mapDispatchToProps)(LoggedInText);