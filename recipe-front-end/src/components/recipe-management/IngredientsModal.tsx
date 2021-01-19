import { Button, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Select } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { Localisation } from "../../localisation/AppTexts";
import { IngredientInput } from "./AddRecipeMenu";

interface OwnProps {
    ingredientInputs: IngredientInput;
    onConfirm: (newValue: IngredientInput) => void;
    onCancel: () => void;
}

const quantityDescriptions = ['stuk', 'gram', 'eetlepel', 'theelepel', 'snufje'];

export function IngredientsModal(props: OwnProps) {
    const focusRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(props.ingredientInputs.name);
    const [quantityNumber, setQuantityNumber] = useState(props.ingredientInputs.quantityNumber);
    const [quantityDescription, setQuantityDescription] = useState<string>(props.ingredientInputs.quantityDescription || quantityDescriptions[0]);
    const canBeSubmitted = name && quantityNumber;

    return (<Modal isOpen={true} onClose={props.onCancel} initialFocusRef={focusRef}>
        <ModalOverlay />
        <ModalContent>
            <ModalCloseButton onClick={props.onCancel} />
            <ModalBody>
                <Heading as="h3">{Localisation.EDIT_INGREDIENT}</Heading>
                <Input  ref={focusRef} 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder={Localisation.INGREDIENT_NAME} 
                />
                <Input  value={quantityNumber || ''} 
                        onChange={(e) => setQuantityNumber(Number(e.target.value) || 0)} 
                        type='number'
                        placeholder={Localisation.QUANTITY} 
                />
                <Select placeholed={Localisation.QUANTITY} onChange={(e) => setQuantityDescription(e.target.selectedOptions[0].value)}>
                    {quantityDescriptions.map((description, index) => {
                        return <option selected={description === props.ingredientInputs.quantityDescription} key={index} value={description}>{description}</option>
                    })}
                </Select>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" disabled={!canBeSubmitted} onClick={() => props.onConfirm({
                    name,
                    quantityNumber,
                    quantityDescription,
                    identifier: props.ingredientInputs.identifier
                })}>{Localisation.ADD}</Button>
                <Button variant="ghost" onClick={() => props.onCancel()}>{Localisation.CANCEL}</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>);
}