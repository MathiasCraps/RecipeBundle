import React from 'react';
import { isSameUtcDay } from '../../../utils/DateUtils';

interface OwnProps {
    day: Date;
    isEnabled: boolean;
}

export function DayCel(props: OwnProps) {
    const dayOfMonth = props.day.getDate();
    const valueToRender = !isNaN(dayOfMonth) ? dayOfMonth : '-';
    const isToday = isSameUtcDay(new Date(), props.day);
    return <span className={`picker-day ${isToday ? 'is-current-day' : ''}`}>{valueToRender}</span>
}