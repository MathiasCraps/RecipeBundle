import { Button, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Select } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { connect } from 'react-redux';
import { Category, Ingredient } from '../../interfaces/Recipe';
import { Localisation } from "../../localisation/AppTexts";
import { translateCategory } from '../../localisation/CategoryLocalisation';
import { ReduxModel } from '../../redux/Store';
import './IngredientsModal.scss';

interface OwnProps {
    ingredientInputs: Ingredient;
    onConfirm: (newValue: Ingredient) => void;
    onCancel: () => void;
}

interface ReduxProps {
    categories: Category[];
}

export const quantityDescriptions = ['stuk', 'gram', 'eetlepel', 'theelepel', 'snufje'];

function mapStateToProps(reduxState: ReduxModel): ReduxProps {
    return {
        categories: reduxState.categories
    }
}

type Props = OwnProps & ReduxProps;

function IngredientsModal(props: Props) {
    const focusRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(props.ingredientInputs.name);
    const [quantityNumber, setQuantityNumber] = useState(props.ingredientInputs.quantity_number);
    const [quantityDescription, setQuantityDescription] = useState<string>(props.ingredientInputs.quantity_description);
    const [categoryId, setCategoryId] = useState<number>(props.ingredientInputs.categoryId);
    const canBeSubmitted = name && quantityNumber;

    return (<Modal isOpen={true} onClose={props.onCancel} initialFocusRef={focusRef}>
        <ModalOverlay />
        <ModalContent>
            <ModalCloseButton onClick={props.onCancel} />
            <ModalBody className="add-ingredients-modal">
                <Heading as="h3">{Localisation.EDIT_INGREDIENT}</Heading>
                <label>
                    {Localisation.INGREDIENT_NAME}
                    <Input ref={focusRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={Localisation.INGREDIENT_NAME}
                    /></label>

                <label>
                    {Localisation.QUANTITY}
                    <Input value={quantityNumber || ''}
                        onChange={(e) => setQuantityNumber(Number(e.target.value) || 0)}
                        type='number'
                        placeholder={Localisation.QUANTITY}
                    />
                </label>
                <label>
                    {Localisation.QUANTITY_KIND}
                    <Select value={quantityDescription} onChange={(e) => setQuantityDescription(e.target.selectedOptions[0].value)}>
                        {quantityDescriptions.map((description, index) => {
                            const capitalizedText = description.charAt(0).toUpperCase() + description.substr(1);
                            return <option key={index} value={description}>{capitalizedText}</option>
                        })}
                    </Select>
                </label>
                <label>
                    {Localisation.CATEGORY_INGREDIENT}
                    <Select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.selectedOptions[0].value))}>
                        {props.categories.map((category) => {
                            return <React.Fragment key={category.categoryId}>
                                <option value={category.categoryId}>
                                    {translateCategory(category.categoryName as any)}
                                </option>
                            </React.Fragment>
                        })}
                    </Select>
                </label>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" disabled={!canBeSubmitted} onClick={() => props.onConfirm({
                    name,
                    quantity_number: quantityNumber,
                    quantity_description: quantityDescription,
                    id: props.ingredientInputs.id,
                    categoryId,
                    categoryName: ''
                })}>{Localisation.ADD}</Button>
                <Button variant="ghost" onClick={() => props.onCancel()}>{Localisation.CANCEL}</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>);
}

export default connect(mapStateToProps)(IngredientsModal);