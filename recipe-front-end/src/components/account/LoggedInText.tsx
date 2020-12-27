import { Box } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { doLogOut } from "../../redux/Actions";

interface Props {
    doLogOut: typeof doLogOut;
}

function LoggedInText(props: Props) {
    return (<Box>
        {Localisation.LOGGED_IN_ENCOURAGING}
        <p><a href='#' onClick={() => props.doLogOut()}>{Localisation.LOG_OUT}</a></p>
    </Box>)
}

export default connect(null, { doLogOut })(LoggedInText);