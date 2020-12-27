import { Box } from "@chakra-ui/react";
import React from "react";
import { Localisation } from "../../localisation/AppTexts";

export function LoggedInText() {
    return (<Box>
        {Localisation.LOGGED_IN_ENCOURAGING}
    </Box>)
}