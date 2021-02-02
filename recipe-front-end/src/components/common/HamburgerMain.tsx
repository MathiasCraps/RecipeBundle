import { Tooltip } from '@chakra-ui/react';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import { Localisation } from '../../localisation/AppTexts';
import { updateMobileFapOpened } from '../../redux/Actions';
import { AnimatedAppear } from './AnimatedAppear';

interface OwnProps {
    isOpened: boolean;
}

interface ReduxActions {
    updateMobileFapOpened: typeof updateMobileFapOpened;
}

type Props = OwnProps & ReduxActions;

function HamburgerMain(props: Props) {
    const label = props.isOpened ? Localisation.LESS_OPTIONS : Localisation.MORE_OPTIONS;
    return <AnimatedAppear>
        <Tooltip label={label}>
            <button className='action-item'
                onClick={() => props.updateMobileFapOpened(!props.isOpened)}
                aria-label={label}>
                <FontAwesomeIcon icon={props.isOpened ? faTimes : faBars} />
            </button>
        </Tooltip>
    </AnimatedAppear>
}

export default connect(null, { updateMobileFapOpened })(HamburgerMain)