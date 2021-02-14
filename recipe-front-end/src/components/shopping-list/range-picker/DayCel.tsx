import React from 'react';

interface OwnProps {
    day: number;
    isEnabled: boolean;
}

export function DayCel(props: OwnProps) {
    const valueToShow = props.day > -1 ? props.day : '*';
    return <span className="picker-day">{valueToShow}</span>
}