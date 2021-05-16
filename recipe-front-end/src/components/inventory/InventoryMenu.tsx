import { Heading, Tooltip } from '@chakra-ui/react';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
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

    return <ContentContainer>
        <Heading as="h2">{Localisation.INVENTORY}</Heading>
        {props.inventory.map((inventoryItem) => <div key={inventoryItem.ingredient.id}>
            {inventoryItem.ingredient.name}: <strong>
                {inventoryItem.quantity}
            </strong> <Tooltip label={Localisation.REMOVE}>
                <FontAwesomeIcon
                    tabIndex={0}
                    icon={faTrash}
                    onClick={() => props.updateInventoryAction(inventoryItem, 'remove')} />
            </Tooltip>
        </div>)}

        <div tabIndex={0} style={{ cursor: 'pointer' }} onClickCapture={() => setModalIsOpened(true)}>
            <FontAwesomeIcon icon={faPlus} /> {Localisation.ADD}
        </div>

        <InventoryModal isOpened={modalIsOpened} onConfirm={() => {
            setModalIsOpened(false);
        }} onCancel={() => {
            setModalIsOpened(false);
        }} />
    </ContentContainer>
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryMenu);