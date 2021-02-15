import React from 'react';

interface OwnProps {
    day: Date;
    isEnabled: boolean;
}

export function DayCel(props: OwnProps) {
    return <span className="picker-day">{props.day.getDate()}</span>
}