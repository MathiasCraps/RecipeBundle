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
    return <div>        
        {gridCurrentMonth.map((week, index) => <WeekRow week={week} key={index} onDayPicked={props.onDayPicked} />)}
    </div>
}