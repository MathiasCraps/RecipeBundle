import { Modal } from '@chakra-ui/modal';
import { Button, Input, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { BaseIngredient } from '../../interfaces/Recipe';
import { Localisation } from '../../localisation/AppTexts';
import { updateInventoryAction, updateInventoryActionReturn } from '../../redux/Actions';
import { InventoryItem, ReduxModel, UpdateInventoryAction } from '../../redux/Store';
import SearchInput from '../common/search/SearchInput';

interface OwnProps {
    isOpened: boolean;
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
    const [selection, setSelection] = useState<BaseIngredient>();
    const [quantity, setQuantity] = useState<number>(0);
    return <Modal isOpen={props.isOpened} onClose={props.onCancel}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{Localisation.ADD_RECIPE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <SearchInput<BaseIngredient>
                    selection={selection}
                    items={props.ingredients}
                    inputRef={ref}
                    onSelectionChange={setSelection}
                    onRender={(value) => value.name}
                    defaultValue={undefined}
                    renderResults={true}
                />

                <div>
                    <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={() => {
                    if (!selection || quantity === undefined) {
                        return;
                    }
                    props.updateInventoryAction({
                        ingredient: selection,
                        quantity
                    })
                    props.onConfirm();
                }}>
                    {Localisation.ADD}
                </Button>
                <Button variant="ghost" onClick={props.onCancel}>{Localisation.CANCEL}</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryModal);