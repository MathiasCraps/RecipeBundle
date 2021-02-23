import { Box, CloseButton, SlideFade } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { Paths } from '../../Paths';

interface OwnProps {
    classes?: string;
    children: React.ReactNode;
}

export default function ContentContainer(props: OwnProps) {
    const classes = props.classes ? { className: props.classes } : {};
    return <Box {...classes}>
        <Link to={Paths.BASE}>
            <CloseButton className="close-button-top-left" autoFocus={true} size="md" />
        </Link>
        <SlideFade in={true}>
            <Box className="card-content" padding="2em" maxWidth="80em" margin="auto">
                {props.children}
            </Box>
        </SlideFade>
    </Box>
}