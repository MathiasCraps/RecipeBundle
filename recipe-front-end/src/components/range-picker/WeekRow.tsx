import React from 'react';
import DayCel from './DayCel';
import { FillDayFilter } from './dayfilters/FillDayFilter';

interface OwnProps {
    week: Date[];
    onDayPicked: (date: Date) => void;
    onDaySelected: (date: Date) => void;
    fillDayFilters: FillDayFilter[];
}

export function WeekRow(props: OwnProps) {
    return <div className="picker-row">{props.week.map((day, index) => <DayCel
        key={index}
        day={day}
        onDayPicked={props.onDayPicked} 
        onDaySelected={props.onDaySelected}
        fillDayFilters={props.fillDayFilters}/>)}
    </div>
}