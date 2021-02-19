import React from 'react';
import { connect } from 'react-redux';
import { ReduxModel } from '../../../redux/Store';
import { dateIsInRange, isSameUtcDay } from '../../../utils/DateUtils';

interface OwnProps {
    day: Date;
    isEnabled: boolean;
    onDayPicked: (date: Date) => void;
}

interface ReduxProps {
    isInRange: boolean;
}

export function mapStateToProps(reduxStore: ReduxModel, ownProps: OwnProps): ReduxProps {
    return {
        isInRange: dateIsInRange(
            ownProps.day,
            reduxStore.shoppingDateRange.start,
            reduxStore.shoppingDateRange.end
        )
    };
}

type Props = OwnProps & ReduxProps;

function DayCel(props: Props) {
    const dayOfMonth = props.day.getDate();
    const valueToRender = !isNaN(dayOfMonth) ? dayOfMonth : '-';
    const classList = [
        'picker-day',
        props.isInRange ? 'in-range' : ''
    ].join(' ');

    return <span className={classList}
        onClick={() => props.onDayPicked(props.day)}>
        {valueToRender}
    </span>
}

export default connect(mapStateToProps)(DayCel)