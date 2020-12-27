import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { toggleLoginForm } from "../../redux/Actions";
import { ReduxModel } from "../../redux/Store";
import { makeQueryString } from "../../utils/UrlUtils";

interface AccountMenuProps {
    loginMenuOpened: boolean;
    loggedIn: boolean;
    userName: string | undefined;
}

interface ReduxActionProps {
    toggleLoginForm: typeof toggleLoginForm;
}

type Props = AccountMenuProps & ReduxActionProps;

function mapStateToProps(reduxStore: ReduxModel): AccountMenuProps {
    return {
        loginMenuOpened: reduxStore.loginMenuOpened,
        loggedIn: reduxStore.loggedIn,
        userName: reduxStore.userName
    };
}

function AccountMenu(props: Props) {
    const queryParams = makeQueryString({
        client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
        scope: 'user:email'
    });

    return (<Drawer
        isOpen={props.loginMenuOpened}
        placement="right"
        isFullHeight={true}
        onClose={() => { props.toggleLoginForm() }}>
        <DrawerOverlay>
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{Localisation.WELCOME} <b>{props.loggedIn ? props.userName : Localisation.NINJA}</b> 🐱‍👤</DrawerHeader>
                <DrawerBody>
                    <p>{Localisation.NOT_YOU}</p>
                    <a href={`https://github.com/login/oauth/authorize?${queryParams}`}>
                        {Localisation.LOGIN_FOR_MORE_FEATURES} <img src='images/github.png' />
                    </a>
                </DrawerBody>
            </DrawerContent>
        </DrawerOverlay>
    </Drawer>);
}

export default connect(mapStateToProps, { toggleLoginForm })(AccountMenu);