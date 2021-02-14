import React from 'react';
import { Localisation } from '../../localisation/AppTexts';

interface OwnProps {
    startTime: Date;
    endTime: Date;
}

function formatDate(date: Date) {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

export function RangePicker(props: OwnProps) {
    return <p>{Localisation.YOUR_SHOPPING_LIST_FOR_THE_PERIOD} {formatDate(props.startTime)} - {formatDate(props.endTime)}:</p>
}