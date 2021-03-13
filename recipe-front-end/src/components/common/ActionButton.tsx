import { Tooltip } from "@chakra-ui/react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { Paths } from '../../Paths';

interface OwnProps {
    icon: IconDefinition;
    label: string;
    linkTo: Paths;
}

export default function MainMenuButton(props: OwnProps) {
    return <Tooltip label={props.label} fontSize="md">
        <Link to={props.linkTo}>
            <button tabIndex={-1} className='action-item'
                aria-label={props.label}>
                <FontAwesomeIcon icon={props.icon} />
            </button>
        </Link>
    </Tooltip>
}