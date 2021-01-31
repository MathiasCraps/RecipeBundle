import { Tooltip } from '@chakra-ui/react';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import { Localisation } from '../../localisation/AppTexts';
import { updateMobileFapOpened } from '../../redux/Actions';
import { CSS_PRIMARY_BUTTON } from './CssClassNames';

interface OwnProps {
    isOpened: boolean;
}

interface ReduxActions {
    updateMobileFapOpened: typeof updateMobileFapOpened;
}

type Props = OwnProps & ReduxActions;

function HamburgerMain(props: Props) {
    return <div className='action-item'>
        <Tooltip label={props.isOpened ? Localisation.LESS_OPTIONS : Localisation.MORE_OPTIONS}>
            <a className={CSS_PRIMARY_BUTTON}
                href='#'
                onClick={() => props.updateMobileFapOpened(!props.isOpened)}>
                <FontAwesomeIcon icon={props.isOpened ? faTimes : faBars} />
            </a>
        </Tooltip>
    </div>
}

export default connect(null, { updateMobileFapOpened })(HamburgerMain)