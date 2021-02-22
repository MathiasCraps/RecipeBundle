import { Tooltip } from "@chakra-ui/react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { Paths } from '../../Paths';
import { changeActiveView, switchMenu } from "../../redux/Actions";
import { OpenedMenu, ViewType } from "../../redux/Store";

interface OwnProps {
    icon: IconDefinition;
    label: string;
    linkTo: Paths;
}

export function MainMenuButton(props: OwnProps) {
    return <Tooltip label={props.label} fontSize="md">
        <Router>
            <Link to={props.linkTo}>
                <button className='action-item'
                    aria-label={props.label}>
                    <FontAwesomeIcon icon={props.icon} />
                </button>
            </Link>
        </Router>
    </Tooltip>;
}