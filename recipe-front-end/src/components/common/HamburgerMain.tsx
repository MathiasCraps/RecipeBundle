import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
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
        <a className={CSS_PRIMARY_BUTTON}
            href='#'
            onClick={() => props.updateMobileFapOpened(!props.isOpened)}>
            <FontAwesomeIcon icon={props.isOpened ? faTimes : faBars} />
        </a>
    </div>
}

export default connect(null, { updateMobileFapOpened })(HamburgerMain)