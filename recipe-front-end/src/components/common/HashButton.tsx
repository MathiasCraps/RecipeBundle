import { Tooltip } from "@chakra-ui/react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Link, HashRouter } from "react-router-dom";
import { Paths } from '../../Paths';
import { changeActiveView, switchMenu } from "../../redux/Actions";
import { OpenedMenu, ViewType } from "../../redux/Store";

interface OwnProps {
    icon: IconDefinition;
    menuToOpen: OpenedMenu;
    label: string;
}

interface ReduxActionProps {
    switchMenu: typeof switchMenu;
}

type Props = OwnProps & ReduxActionProps;

function HashButton(props: Props) {
    return <Tooltip label={props.label} fontSize="md">
        <button className='action-item'
            aria-label={props.label}
            onClick={() => props.switchMenu(props.menuToOpen)} >
            <FontAwesomeIcon icon={props.icon} />
        </button>
    </Tooltip>;
}

export default connect(null, { switchMenu })(HashButton);