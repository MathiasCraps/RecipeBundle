import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../localisation/AppTexts";
import { toggleLoginForm } from "../redux/Actions";
import { ReduxModel } from "../redux/Store";

interface AccountMenuProps {
    loginMenuOpened: boolean;
}

interface ReduxActionProps {
    toggleLoginForm: typeof toggleLoginForm;
}

type Props = AccountMenuProps & ReduxActionProps;

function mapStateToProps(reduxStore: ReduxModel): AccountMenuProps {
    return {
        loginMenuOpened: reduxStore.loginMenuOpened
    };
}

function AccountMenu(props: Props) {
    return (<Drawer isOpen={props.loginMenuOpened} placement="right" isFullHeight={true} onClose={() => {props.toggleLoginForm()}}>
        <DrawerOverlay>
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{Localisation.WELCOME} <b>{Localisation.NINJA}</b> 🐱‍👤</DrawerHeader>
                <DrawerBody>
                    <p>{Localisation.NOT_YOU}</p>
                    <a href='#'>{Localisation.LOGIN_FOR_MORE_FEATURES} <img src='images/github.png' /></a>
        </DrawerBody>
            </DrawerContent>
        </DrawerOverlay>
    </Drawer>);
}

export default connect(mapStateToProps, {toggleLoginForm})(AccountMenu);