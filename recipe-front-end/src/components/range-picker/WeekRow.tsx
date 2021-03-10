import React from 'react';
import DayCel from './DayCel';

interface OwnProps {
    week: Date[];
    onDayPicked: (date: Date) => void;
    onDaySelected: (date: Date) => void;
}

export function WeekRow(props: OwnProps) {
    return <div className="picker-row">{props.week.map((day, index) => <DayCel
        key={index}
        day={day}
        isEnabled={true}
        onDayPicked={props.onDayPicked} 
        onDaySelected={props.onDaySelected}/>)}
    </div>
}