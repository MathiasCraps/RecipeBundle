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
import './InventoryMenu.scss';
import { QuantityDescription } from '../../interfaces/Recipe';
import { convertArrayToLinkedMap, LinkedMap } from '../../utils/ArrayUtils';

interface ReduxProps {
    loggedIn: boolean;
    inventory: InventoryItem[];
    quantityDescriptions: LinkedMap<QuantityDescription>;
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
        inventory: reduxModel.inventory,
        quantityDescriptions: convertArrayToLinkedMap(reduxModel.quantityDescriptions, 'quantityDescriptorId')
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

    const [addIngredientModalOpened, setAddIngredientModalOpened] = useState(false);

    return <ContentContainer>
        <Heading as="h2">{Localisation.INVENTORY}</Heading>
        <button style={{ cursor: 'pointer' }} onClick={() => setModalIsOpened(true)}>
            <FontAwesomeIcon icon={faPlus} /> {Localisation.ADD}
        </button>

        <table className="inventory-table">
            <thead>
                <tr>
                    <th>{Localisation.INGREDIENT_NAME}</th>
                    <th>{Localisation.QUANTITY}</th>
                    <th>{Localisation.DESIRED_QUANTITY}</th>
                    <th>{Localisation.ACTIONS}</th>
                </tr>
            </thead>

            <tbody>
                {props.inventory.map((inventoryItem) => {
                    const quantityDescription = props.quantityDescriptions[inventoryItem.ingredient.quantity_description_id];
                    
                    return <tr style={{ paddingTop: '0.5em' }} key={inventoryItem.ingredient.id}>
                        <td><strong>{inventoryItem.ingredient.name} ({quantityDescription.translations['nl']})</strong></td>
                        <td>{inventoryItem.quantity}</td>
                        <td>{inventoryItem.desiredQuantity}</td>
                        <td><Tooltip label={Localisation.EDIT_DETAILS}>
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
                            </Tooltip></td>
                    </tr>
                })}
            </tbody>
        </table>

        <button style={{ cursor: 'pointer' }} onClick={() => setAddIngredientModalOpened(true)}>
            <FontAwesomeIcon icon={faPlus} /> {Localisation.ADD_INGREDIENT}
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