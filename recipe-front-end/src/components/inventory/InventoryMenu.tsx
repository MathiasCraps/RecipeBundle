import { Heading, Tooltip } from '@chakra-ui/react';
import { faPencilAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Dispatch } from 'redux';
import { Localisation } from '../../localisation/AppTexts';
import { Paths } from '../../Paths';
import { updateInventoryAction, updateInventoryActionReturn } from '../../redux/Actions';
import { InventoryItem, ReduxModel, UpdateInventoryAction } from '../../redux/Store';
import ContentContainer from '../common/ContentContainer';
import InventoryModal from './InventoryModal';

interface ReduxProps {
    loggedIn: boolean;
    inventory: InventoryItem[];
}

interface ReduxActions {
    updateInventoryAction: updateInventoryActionReturn;
}

type Props = ReduxProps & ReduxActions;

function mapDispatchToProps(dispatch: Dispatch<UpdateInventoryAction>): ReduxActions {
    return {
        updateInventoryAction: updateInventoryAction(dispatch)
    }
}

function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        loggedIn: reduxModel.user.loggedIn,
        inventory: reduxModel.inventory
    };
}

function InventoryMenu(props: Props) {
    if (!props.loggedIn) {
        return <Redirect to={Paths.BASE} />
    }

    const [modalIsOpened, setModalIsOpened] = useState(false);
    const [
        inventoryItemToEdit,
        setInventoryItemToEdit
    ] = useState<InventoryItem | undefined>(undefined);

    return <ContentContainer>
        <Heading as="h2">{Localisation.INVENTORY}</Heading>
        {props.inventory.map((inventoryItem) => <div style={{ paddingTop: '0.5em' }} key={inventoryItem.ingredient.id}>
            {inventoryItem.ingredient.name}: <strong>
                {inventoryItem.quantity}
            </strong> <div style={{ marginLeft: '0.5em' }}><Tooltip label={Localisation.EDIT_DETAILS}>
                <button onClick={() => {
                    setInventoryItemToEdit(inventoryItem);
                    setModalIsOpened(true)
                }}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                </button>
            </Tooltip> <Tooltip label={Localisation.REMOVE}>
                    <button onClick={() => props.updateInventoryAction(inventoryItem, 'remove')}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </Tooltip></div>
        </div>)}

        <button style={{ cursor: 'pointer' }} onClick={() => setModalIsOpened(true)}>
            <FontAwesomeIcon icon={faPlus} /> {Localisation.ADD}
        </button>

        {modalIsOpened && <InventoryModal initialValue={inventoryItemToEdit && { ...inventoryItemToEdit }} isOpened={modalIsOpened} onConfirm={() => {
            setModalIsOpened(false);
            setInventoryItemToEdit(undefined);
        }} onCancel={() => {
            setModalIsOpened(false);
            setInventoryItemToEdit(undefined);
        }} />}
    </ContentContainer>
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryMenu);