import React from 'react';
import { FULL_DAY_IN_MS } from '../../../utils/DateUtils';
import { DayCel } from './DayCel';

interface OwnProps {
    startOfWeek: Date;
}

function normalizeDays(day: number): number {    
    if (day === 0) {
        return 6;
    }
    return day - 1;
}

export function WeekRow(props: OwnProps) {
    const normalizedWeekDay = normalizeDays(props.startOfWeek.getDay());

    const days: React.ReactNode[] = [];
    for (let i = 0; i < 7; i++) {
        if (i < normalizedWeekDay) {
            days.push(<DayCel day={-1} isEnabled={false} />);
            continue;
        }

        const day = new Date(+props.startOfWeek + (FULL_DAY_IN_MS * i - normalizedWeekDay)).getDate();
        days.push(<DayCel day={day} isEnabled={true} />);
    }

    return <div className="picker-row">{days}</div>
}