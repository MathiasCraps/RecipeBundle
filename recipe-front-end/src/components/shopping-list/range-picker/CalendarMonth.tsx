import React from 'react';
import { calculateMonthGrid } from '../../../utils/DateUtils';
import { WeekRow } from './WeekRow';

interface OwnProps {
    date: Date;
    isVisible: boolean;
    onDayPicked: (date: Date) => void;
}

export function CalendarMonth(props: OwnProps) {
    if (!props.isVisible) {
        return <div></div>
    }

    const gridCurrentMonth = calculateMonthGrid(props.date.getFullYear(), props.date.getMonth());
    return <div className="month-grid">
        {gridCurrentMonth.map((week, index) => <WeekRow
            key={index}
            week={week}
            onDayPicked={props.onDayPicked}
        />)}</div>
}