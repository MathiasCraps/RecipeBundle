import React from 'react';

interface OwnProps {
    day: Date;
    isEnabled: boolean;
}

export function DayCel(props: OwnProps) {
    const dayOfMonth = props.day.getDate();
    const valueToRender = !isNaN(dayOfMonth) ? dayOfMonth : '-';
    return <span className="picker-day">{valueToRender}</span>
}