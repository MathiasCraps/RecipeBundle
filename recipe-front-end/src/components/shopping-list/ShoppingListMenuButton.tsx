import { Tooltip } from '@chakra-ui/react';
import { faCarrot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import { Localisation } from '../../localisation/AppTexts';
import { changeActiveView } from '../../redux/Actions';
import { ReduxModel, ViewType } from '../../redux/Store';

interface ReduxProps {
    loggedIn: boolean;
}

interface ReduxActions {
    changeActiveView: typeof changeActiveView;
}

function mapStateToProps(reduxStore: ReduxModel): ReduxProps {
    return {
        loggedIn: reduxStore.user.loggedIn
    }
}

type Props = ReduxProps & ReduxActions;

function ShoppingListMenuButton(props: Props) {
    if (!props.loggedIn) {
        return <span></span>
    }

    return <Tooltip label={Localisation.SHOPPING_LIST} fontSize="md">
        <button className='action-item'
            onClick={() => props.changeActiveView(ViewType.ShoppingList, undefined)}
            aria-label={Localisation.SHOPPING_LIST}>
            <FontAwesomeIcon icon={faCarrot} />
        </button>
    </Tooltip>;
}

export default connect(mapStateToProps, { changeActiveView })(ShoppingListMenuButton);