import { Tooltip } from "@chakra-ui/react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { changeActiveView, switchMenu } from "../../redux/Actions";
import { OpenedMenu, ViewType } from "../../redux/Store";

interface OwnProps {
    icon: IconDefinition;
    menuToOpen?: OpenedMenu;
    viewToOpen?: ViewType;
    label: string;
}

interface ReduxActionProps {
    switchMenu: typeof switchMenu;
    changeActiveView: typeof changeActiveView;
}

type Props = OwnProps & ReduxActionProps;

function MainMenuButton(props: Props) {
    const changeView = props.menuToOpen 
        ? () => props.switchMenu(props.menuToOpen!)
        : () => props.changeActiveView(props.viewToOpen!, undefined)
    return <Tooltip label={props.label} fontSize="md">
        <button className='action-item'
            onClick={changeView}
            aria-label={props.label}>
            <FontAwesomeIcon icon={props.icon} />
        </button>
    </Tooltip>;
}

export default connect(null, { switchMenu, changeActiveView })(MainMenuButton);