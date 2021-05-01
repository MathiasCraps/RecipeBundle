import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { switchMenu } from "../../redux/Actions";
import { OpenedMenu, ReduxModel, UserData } from "../../redux/Store";
import LoggedInText from "./LoggedInText";
import { NotLoggedIn } from "./NotLoggedInText";

interface AccountMenuProps {
    loginMenuOpened: boolean;
    user: UserData;
}

interface ReduxActionProps {
    switchMenu: typeof switchMenu;
}

type Props = AccountMenuProps & ReduxActionProps;

function mapStateToProps(reduxStore: ReduxModel): AccountMenuProps {
    return {
        loginMenuOpened: reduxStore.openedMenu === OpenedMenu.SESSION,
        user: reduxStore.user
    };
}

function AccountMenu(props: Props) {
    const displayedUserName = props.user.loggedIn ? `${props.user.name} 🐱‍👓` : `${Localisation.NINJA} 🐱‍👤`;

    return (<Drawer
        isOpen={props.loginMenuOpened}
        placement="right"
        isFullHeight={true}
        onClose={() => { props.switchMenu(OpenedMenu.NONE) }}>
        <DrawerOverlay>
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    <b>{`${Localisation.WELCOME} ${displayedUserName}`}</b>
                </DrawerHeader>
                <DrawerBody>
                    {props.user.loggedIn ? <LoggedInText /> : <NotLoggedIn extraText={Localisation.NOT_YOU} />}
                </DrawerBody>
            </DrawerContent>
        </DrawerOverlay>
    </Drawer>);
}

export default connect(mapStateToProps, { switchMenu })(AccountMenu);