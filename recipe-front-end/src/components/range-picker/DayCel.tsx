import React from 'react';
import { connect } from 'react-redux';
import { ReduxModel } from '../../redux/Store';
import { dateIsInRange } from '../../utils/DateUtils';
import { FillDayFilter } from './dayfilters/FillDayFilter';

interface OwnProps {
    day: Date;
    onDayPicked: (date: Date) => void;
    onDaySelected: (date: Date) => void;
    fillDayFilters: FillDayFilter[];
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
    const shouldBeColored = props.fillDayFilters.some((rule) => rule(props.day));
    const dayOfMonth = props.day.getDate();
    const valueToRender = !isNaN(dayOfMonth) ? dayOfMonth : '-';

    return <span tabIndex={-1}
        className={`picker-day ${shouldBeColored ? 'in-range' : ''}`}
        onClick={() => !isNaN(Number(props.day)) && props.onDayPicked(props.day)}
        onMouseOver={() => !isNaN(Number(props.day)) && props.onDaySelected(props.day)}>
        {valueToRender}
    </span>
}

export default connect(mapStateToProps)(DayCel)