import React from 'react';
import { DayCel } from './DayCel';

interface OwnProps {
    week: Date[];
    onClicked: (date: Date) => void;
}

export function WeekRow(props: OwnProps) {
    return <div className="picker-row">{props.week.map((day, index) => <DayCel key={index} day={day} isEnabled={true} onClicked={props.onClicked} />)}</div>
}