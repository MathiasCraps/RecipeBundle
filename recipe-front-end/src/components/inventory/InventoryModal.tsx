import { Modal } from '@chakra-ui/modal';
import { Button, Input, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useToast } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { BaseIngredient, Category, QuantityDescription } from '../../interfaces/Recipe';
import { Localisation } from '../../localisation/AppTexts';
import { addIngredientAction, addIngredientReturn, updateInventoryAction, updateInventoryActionReturn } from '../../redux/Actions';
import { AddIngredientAction, InventoryItem, ReduxModel, UpdateInventoryAction, UpdateInventoryModification } from '../../redux/Store';
import SearchInput from '../common/search/SearchInput';
import { createEmptyIngredient } from '../recipe-management/RecipeEditor';
import './InventoryModal.scss';

interface OwnProps {
    isOpened: boolean;
    initialValue: InventoryItem | undefined;
    onConfirm: () => void;
    onCancel: () => void;
}

interface ReduxProps {
    ingredients: BaseIngredient[];
    quantityDescriptions: QuantityDescription[];
    categories: Category[];
}

interface ReduxActions {
    updateInventoryAction: updateInventoryActionReturn;
    addIngredient: addIngredientReturn;
}

function mapStateToProps(model: ReduxModel): ReduxProps {
    return {
        ingredients: model.ingredients,
        quantityDescriptions: model.quantityDescriptions,
        categories: model.categories
    };
}

function mapDispatchToProps(dispatch: Dispatch<UpdateInventoryAction|AddIngredientAction>): ReduxActions {
    return {
        updateInventoryAction: updateInventoryAction(dispatch),
        addIngredient: addIngredientAction(dispatch)
    }
}

type Props = OwnProps & ReduxProps & ReduxActions;

function InventoryModal(props: Props) {
    const ref = useRef<HTMLInputElement>(null);
    const fallbackRef = useRef<HTMLInputElement>(null);
    const [selection, setSelection] = useState<BaseIngredient | undefined>(props.initialValue?.ingredient);
    const [quantity, setQuantity] = useState<number | undefined>(props.initialValue?.quantity);
    const [desiredQuantity, setDesiredQuantity] = useState<number | undefined>(props.initialValue?.desiredQuantity);
    const toast = useToast();
    const [creatingNewIngredient, setCreatingNewIngredient] = useState(false);
    const canBeSubmitted = Boolean(selection && (typeof quantity === 'number' && quantity >= 0) || (typeof desiredQuantity === 'number' && desiredQuantity >= 0));

    useEffect(() => {
        const target = ref.current;
        if (!target) {
            return;
        }

        function handleCreatingNewIngredient() {
            if (!target) {
                return;
            }

            if (target.value && selection?.name.toLowerCase() !== target.value.toLocaleLowerCase()) {
                setCreatingNewIngredient(true);
                setSelection({
                    ...createEmptyIngredient(props.categories[0], props.quantityDescriptions[0]),
                    name: target.value
                })
            } else {
                setCreatingNewIngredient(false);
            }
        }

        target.addEventListener('keyup', handleCreatingNewIngredient);

        return () => target.removeEventListener('keyup', handleCreatingNewIngredient);
    });

    return <Modal isOpen={props.isOpened} onClose={props.onCancel} initialFocusRef={props.initialValue ? fallbackRef : ref}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{Localisation.ADD_RECIPE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <SearchInput<BaseIngredient>
                    selection={selection}
                    disabled={Boolean(props.initialValue)}
                    items={props.ingredients}
                    inputRef={ref}
                    onSelectionChange={setSelection}
                    onRender={(value) => value.name}
                    defaultValue={props.initialValue?.ingredient.name}
                    renderResults={true}
                    label={Localisation.INGREDIENT}
                />

                {creatingNewIngredient && <div className="extra-ingredient-options">
                    <hr/>
                    <p>{Localisation.INGREDIENT_DOES_NOT_EXIST_ADDING}</p>
                    <label>
                        {Localisation.QUANTITY_KIND}
                        <Select disabled={!creatingNewIngredient} value={selection?.quantityDescription?.quantityDescriptorId} onChange={(e) => {
                            const match = props.quantityDescriptions.find((entry) => {
                                return String(entry.quantityDescriptorId) === e.target.selectedOptions[0].value
                            });
                            if (match && selection) {
                                setSelection({
                                    ...selection,
                                    quantityDescription: match,
                                    quantity_description_id: match.quantityDescriptorId
                                })
                            }
                        }}>
                            {props.quantityDescriptions.map((description, index) => {
                                const text = description.translations['nl'];

                                const capitalizedText = text.charAt(0).toUpperCase() + text.substr(1);
                                return <option key={index} value={description.quantityDescriptorId}>{capitalizedText}</option>
                            })}
                        </Select>
                    </label>

                    <label>
                        {Localisation.CATEGORY_INGREDIENT}
                        <Select disabled={!creatingNewIngredient} value={selection?.categoryId} onChange={(e) => {
                            if (selection) {
                                setSelection({
                                    ...selection,
                                    categoryId: Number(e.target.selectedOptions[0].value)
                                });
                            }

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
                    <hr/>
                </div>}


                <label>{Localisation.QUANTITY}<br />
                    <Input
                        type="number"
                        placeholder={Localisation.QUANTITY}
                        value={typeof quantity === 'number' ? quantity : ''}
                        ref={fallbackRef}
                        onChange={(e) => !Number.isNaN(e.target.value) && setQuantity(Number(e.target.value))}
                    />
                </label>

                <label>{Localisation.DESIRED_QUANTITY}<br />
                    <Input
                        type="number"
                        placeholder={Localisation.DESIRED_QUANTITY}
                        value={typeof desiredQuantity === 'number' ? desiredQuantity : ''}
                        onChange={(e) => !Number.isNaN(e.target.value) && setDesiredQuantity(Number(e.target.value))}
                    />
                </label>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" disabled={!canBeSubmitted} mr={3} onClick={async () => {
                    if (!canBeSubmitted || !selection) {
                        return;
                    }

                    const action: UpdateInventoryModification = props.initialValue ? 'update' : 'add';
                    let modified = selection;

                    if (creatingNewIngredient) {
                        const ingredientId = await props.addIngredient(selection);
                        modified = {
                            ...selection,
                            id: ingredientId
                        };    
                    }

                    const success = await props.updateInventoryAction({
                        ingredient: modified,
                        quantity: quantity!,
                        desiredQuantity: desiredQuantity!
                    }, action);

                    if (success) {
                        if (creatingNewIngredient) {
                            setSelection(modified);
                        }

                        toast({
                            description: Localisation.ADDING_WAS_SUCCESS,
                            status: 'success'
                        });

                        props.onConfirm();
                    } else {
                        toast({
                            description: Localisation.ADDING_FAILED,
                            status: 'error'
                        });
                    }
                }}>
                    {Localisation.ADD}
                </Button>
                <Button variant="ghost" onClick={props.onCancel}>{Localisation.CANCEL}</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryModal);