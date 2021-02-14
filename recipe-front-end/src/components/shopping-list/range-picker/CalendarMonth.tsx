import React from 'react';
import { WeekRow } from './WeekRow';

interface OwnProps {
    date: Date;
    isVisible: boolean;
}

export function CalendarMonth(props: OwnProps) {
    if (!props.isVisible) {
        return <div></div>
    }

    const startOfMonth = new Date(Date.UTC(props.date.getFullYear(), props.date.getMonth(), 1));
    // const 
    return <div>
        <WeekRow startOfWeek={startOfMonth}/>
    </div>
}