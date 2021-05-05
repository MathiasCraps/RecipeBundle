import { Box } from "@chakra-ui/react";
import React from "react";
import { Localisation } from "../../localisation/AppTexts";
import { makeQueryString } from "../../utils/UrlUtils";

interface OwnProps {
    extraText: string;
}

export function NotLoggedIn(props: OwnProps) {
    const queryParams = makeQueryString({
        client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
        scope: 'user:email'
    });
    
    return (<Box><p>{props.extraText}</p>
    <a href={`https://github.com/login/oauth/authorize?${queryParams}`}>
        {Localisation.LOGIN_FOR_MORE_FEATURES} <img src='images/github.png' />
    </a></Box>);
}