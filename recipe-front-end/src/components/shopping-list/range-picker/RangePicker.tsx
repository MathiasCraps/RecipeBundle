import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Localisation } from '../../../localisation/AppTexts';
import { ReduxModel } from '../../../redux/Store';
import { CalendarMonth } from './CalendarMonth';

interface ReduxProps {
    startDate: Date;
    endDate: Date;
}

function formatDate(date: Date) {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        startDate: reduxModel.shoppingDateRange.start,
        endDate: reduxModel.shoppingDateRange.end
    }
}

function RangePicker(props: ReduxProps) {
    const [isVisible, setIsvisible] = useState(false);
    return <>
        <p>{Localisation.YOUR_SHOPPING_LIST_FOR_THE_PERIOD} <a
            href="#"
            className="date-range-initiator"
            tabIndex={0}
            onClick={() => setIsvisible(!isVisible)}>{formatDate(props.startDate)} - {formatDate(props.endDate)}
        </a>:</p>
        <CalendarMonth isVisible={isVisible}
            date={new Date()}
            onDayPicked={(day: Date) => console.log('clicked', day)}
        />
    </>
}

export default connect(mapStateToProps)(RangePicker);