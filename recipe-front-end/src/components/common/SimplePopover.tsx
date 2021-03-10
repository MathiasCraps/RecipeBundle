import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from '@chakra-ui/react';
import React from 'react';
import { Localisation } from '../../localisation/AppTexts';

interface OwnProps {
    trigger: React.ReactNode;
    isOpened: boolean;
    children: React.ReactNode;
    onClose:() => void;
    initialFocusRef: React.RefObject<HTMLDivElement>
}

export default function SimplePopover(props: OwnProps) {
    return <Popover
    placement="bottom"
    closeOnBlur={true}
    isOpen={props.isOpened}
    initialFocusRef={props.initialFocusRef}
    onClose={() => props.onClose()}
>
    <PopoverTrigger>
        {props.trigger}
    </PopoverTrigger>
    <PopoverContent>
        <PopoverHeader paddingTop="0.5em" fontWeight="bold" border="0">
            {Localisation.PLAN_IN}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
            {props.children}
        </PopoverBody>
    </PopoverContent>
</Popover>
}