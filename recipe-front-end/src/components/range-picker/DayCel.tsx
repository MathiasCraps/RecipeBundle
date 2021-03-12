import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { ReduxModel } from '../../redux/Store';
import { dateIsInRange } from '../../utils/DateUtils';
import { FillDayFilter } from './dayfilters/FillDayFilter';
import { DatePickerContext } from './RangePicker';

interface OwnProps {
    day: Date;
    isEnabled: boolean;
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
    const draftSelectedDay = useContext(DatePickerContext);
    const isInDraftRange = draftSelectedDay
        ? dateIsInRange(props.day, draftSelectedDay.start, draftSelectedDay.end)
        : false;
    const dayOfMonth = props.day.getDate();
    const valueToRender = !isNaN(dayOfMonth) ? dayOfMonth : '-';
    const classList = [
        'picker-day',
        isInDraftRange || (!draftSelectedDay && props.isInRange) ? 'in-range' : ''
    ].join(' ');

    return <span tabIndex={-1} className={classList}
        onClick={() => !isNaN(Number(props.day)) && props.onDayPicked(props.day)}
        onMouseOver={() => !isNaN(Number(props.day)) && props.onDaySelected(props.day)}>
        {valueToRender}
    </span>
}

export default connect(mapStateToProps)(DayCel)