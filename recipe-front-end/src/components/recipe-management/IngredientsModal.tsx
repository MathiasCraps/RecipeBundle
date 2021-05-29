import { Button, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Select } from "@chakra-ui/react";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from "react";
import { connect } from 'react-redux';
import { BaseIngredient, Category, Ingredient, QuantifiedIngredient } from '../../interfaces/Recipe';
import { Localisation } from "../../localisation/AppTexts";
import { ReduxModel } from '../../redux/Store';
import SearchInput from '../common/search/SearchInput';
import './IngredientsModal.scss';
import { createEmptyIngredient } from './RecipeEditor';

interface OwnProps {
    ingredientInputs: QuantifiedIngredient;
    onConfirm: (newValue: QuantifiedIngredient) => void;
    onCancel: () => void;
}

interface ReduxProps {
    categories: Category[];
    availableIngredients: BaseIngredient[];
}

export const quantityDescriptions = ['stuk', 'gram', 'eetlepel', 'theelepel', 'snufje'];

function mapStateToProps(reduxState: ReduxModel): ReduxProps {
    return {
        categories: reduxState.categories,
        availableIngredients: reduxState.ingredients
    }
}

type Props = OwnProps & ReduxProps;

function IngredientsModal(props: Props) {
    const focusRef = useRef<HTMLInputElement>(null);
    const [ingredient, setIngredient] = useState<QuantifiedIngredient>(props.ingredientInputs);
    const [quantityNumber, setQuantityNumber] = useState(props.ingredientInputs.quantity_number);
    const [forceShowExtraOptions, setForceShowExtraOptions] = useState(false);
    const shouldShowExtraOptions = ingredient.id < 0 || forceShowExtraOptions; // negative id = new
    const hasName = Boolean(ingredient?.name || focusRef.current?.value);
    const canBeSubmitted = Boolean(shouldShowExtraOptions ? hasName && quantityNumber : ingredient);
    const [searchIsActive, setSearchIsActive] = useState(false);

    useEffect(() => {
        if (!focusRef.current) {
            return;
        }

        function onFocus() {
            setSearchIsActive(true);
        }

        function onBlur() {
            const value = focusRef.current?.value || '';
            if (value && ingredient.name !== value) {
                const ingredient = createEmptyIngredient();
                ingredient.name = value;
                setIngredient(ingredient);
            }

            setSearchIsActive(false);
        }

        focusRef.current.addEventListener('focus', onFocus);
        focusRef.current.addEventListener('blur', onBlur);
        return () => {
            focusRef.current?.removeEventListener('focus', onFocus)
            focusRef.current?.removeEventListener('blur', onBlur);
        }
    });

    return (<Modal isOpen={true} onClose={props.onCancel} initialFocusRef={focusRef}>
        <ModalOverlay />
        <ModalContent>
            <ModalCloseButton onClick={props.onCancel} />
            <ModalBody className="add-ingredients-modal">
                <Heading as="h3">{Localisation.EDIT_INGREDIENT}</Heading>
                {Localisation.INGREDIENT_NAME}
                <SearchInput<BaseIngredient>
                    selection={ingredient}
                    onRender={(ingredient) => ingredient.name}
                    items={props.availableIngredients}
                    onSelectionChange={(draftIngredient) => {
                        if (!draftIngredient) {
                            draftIngredient = createEmptyIngredient();
                            draftIngredient.name = focusRef.current?.value || '';
                        } else {
                            draftIngredient = {
                                ...createEmptyIngredient(),
                                ...draftIngredient
                            }
                        }

                        setIngredient(draftIngredient as Ingredient);
                    }}
                    inputRef={focusRef}
                    renderResults={searchIsActive}
                    defaultValue={props.ingredientInputs.name}
                    label={Localisation.INGREDIENT}
                />

                <label>
                    {Localisation.QUANTITY}
                    <Input value={quantityNumber || ''}
                        onChange={(e) => setQuantityNumber(Number(e.target.value) || 0)}
                        type='number'
                        placeholder={Localisation.QUANTITY}
                    />
                </label>

                {!shouldShowExtraOptions && <div
                    className="edit-full"
                    tabIndex={0}
                    onClick={() => setForceShowExtraOptions(true)}
                    onKeyUpCapture={(event) => {
                        if (event.key === 'Enter') {
                            setForceShowExtraOptions(true);
                        }
                    }}
                >   <FontAwesomeIcon icon={faPencilAlt} /> {Localisation.EDIT_DETAILS}
                </div>}

                {shouldShowExtraOptions && <div><label>
                    {Localisation.QUANTITY_KIND}
                    <Select disabled={!shouldShowExtraOptions} value={ingredient.quantity_description} onChange={(e) => {
                        setIngredient({
                            ...ingredient,
                            quantity_description: e.target.selectedOptions[0].value
                        })
                    }}>
                        {quantityDescriptions.map((description, index) => {
                            const capitalizedText = description.charAt(0).toUpperCase() + description.substr(1);
                            return <option key={index} value={description}>{capitalizedText}</option>
                        })}
                    </Select>
                </label>

                    <label>
                        {Localisation.CATEGORY_INGREDIENT}
                        <Select disabled={!shouldShowExtraOptions} value={ingredient.categoryId} onChange={(e) => {
                            setIngredient({
                                ...ingredient,
                                categoryId: Number(e.target.selectedOptions[0].value)
                            });
                        }}>
                            {props.categories.map((category) => {
                                return <React.Fragment key={category.categoryId}>
                                    <option value={category.categoryId}>
                                        {category.translations.nl}
                                    </option>
                                </React.Fragment>
                            })}
                        </Select>
                    </label>
                </div>}
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" disabled={!canBeSubmitted} onClick={() => props.onConfirm({
                    name: ingredient.name,
                    quantity_number: quantityNumber,
                    quantity_description: ingredient.quantity_description,
                    id: ingredient.id,
                    categoryId: ingredient.categoryId,
                    category: ingredient.category
                })}>{Localisation.ADD}</Button>
                <Button variant="ghost" onClick={() => props.onCancel()}>{Localisation.CANCEL}</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>);
}

export default connect(mapStateToProps)(IngredientsModal);