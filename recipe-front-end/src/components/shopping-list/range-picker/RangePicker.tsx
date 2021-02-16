import React, { useState } from 'react';
import { Localisation } from '../../../localisation/AppTexts';
import { CalendarMonth } from './CalendarMonth';

interface OwnProps {
    startTime: Date;
    endTime: Date;
}

function formatDate(date: Date) {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

export function RangePicker(props: OwnProps) {
    const [isVisible, setIsvisible] = useState(false);
    return <>
        <p>{Localisation.YOUR_SHOPPING_LIST_FOR_THE_PERIOD} <span className="date-range-initiator" onClick={() => setIsvisible(!isVisible)}>{formatDate(props.startTime)} - {formatDate(props.endTime)}</span>:</p>
        <CalendarMonth isVisible={isVisible} date={new Date(2021, 3, 1)} />
    </>
}