import { Modal } from '@chakra-ui/modal';
import { Button, Input, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { BaseIngredient } from '../../interfaces/Recipe';
import { Localisation } from '../../localisation/AppTexts';
import { updateInventoryAction, updateInventoryActionReturn } from '../../redux/Actions';
import { InventoryItem, ReduxModel, UpdateInventoryAction, UpdateInventoryModification } from '../../redux/Store';
import SearchInput from '../common/search/SearchInput';

interface OwnProps {
    isOpened: boolean;
    initialValue: InventoryItem | undefined;
    onConfirm: () => void;
    onCancel: () => void;
}

interface ReduxProps {
    ingredients: BaseIngredient[];
}

interface ReduxActions {
    updateInventoryAction: updateInventoryActionReturn;
}

function mapStateToProps(model: ReduxModel): ReduxProps {
    return {
        ingredients: model.ingredients
    };
}

function mapDispatchToProps(dispatch: Dispatch<UpdateInventoryAction>): ReduxActions {
    return {
        updateInventoryAction: updateInventoryAction(dispatch)
    }
}

type Props = OwnProps & ReduxProps & ReduxActions;

function InventoryModal(props: Props) {
    const ref = useRef<HTMLInputElement>(null);
    const [selection, setSelection] = useState<BaseIngredient | undefined>(props.initialValue?.ingredient);
    const [quantity, setQuantity] = useState<number>(props.initialValue?.quantity || 0);
    const toast = useToast();
    const canBeSubmitted = Boolean(selection && quantity && quantity > 0);

    return <Modal isOpen={props.isOpened} onClose={props.onCancel} initialFocusRef={ref}>
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
                />

                <div>
                    <Input
                        type="number"
                        placeholder={Localisation.QUANTITY}
                        value={quantity || ''}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" disabled={!canBeSubmitted} mr={3} onClick={async () => {
                    if (!canBeSubmitted) {
                        return;
                    }
                    
                    const action: UpdateInventoryModification = props.initialValue ? 'update' : 'add';
                    const success = await props.updateInventoryAction({
                        ingredient: selection!,
                        quantity
                    }, action);

                    if (success) {
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