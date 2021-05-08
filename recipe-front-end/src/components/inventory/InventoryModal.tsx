import { Modal } from '@chakra-ui/modal';
import { Button, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react';
import { Localisation } from '../../localisation/AppTexts';

interface OwnProps {
    isOpened: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function InventoryModal(props: OwnProps) {
    return <Modal isOpen={props.isOpened} onClose={props.onCancel}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{Localisation.ADD_RECIPE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                { }
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={props.onConfirm}>
                    {Localisation.ADD}
                </Button>
                <Button variant="ghost" onClick={props.onCancel}>{Localisation.CANCEL}</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
}