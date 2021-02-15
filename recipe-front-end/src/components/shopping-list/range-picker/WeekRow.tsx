import React from 'react';
import { DayCel } from './DayCel';

interface OwnProps {
    week: Date[];
}

export function WeekRow(props: OwnProps) {
    return <div className="picker-row">{props.week.map((day, index) => <DayCel key={index} day={day} isEnabled={true} />)}</div>
}