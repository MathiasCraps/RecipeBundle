import React from 'react';
import { Localisation } from '../../localisation/AppTexts';
import { calculateMonthGrid } from '../../utils/DateUtils';
import { FillDayFilter } from './dayfilters/FillDayFilter';
import { WeekRow } from './WeekRow';
import './CalendarMonth.scss';

interface OwnProps {
    date: Date;
    isVisible: boolean;
    onDayPicked: (date: Date) => void;
    onDaySelected: (date: Date) => void;
    fillDayFilters: FillDayFilter[];
}

const MONTHS = [
    Localisation.JANUARY,
    Localisation.FEBRUARY,
    Localisation.MARCH,
    Localisation.APRIL,
    Localisation.MAY,
    Localisation.JUNE,
    Localisation.JULY,
    Localisation.AUGUST,
    Localisation.SEPTEMBER,
    Localisation.OCTOBER,
    Localisation.NOVEMBER,
    Localisation.DECEMBER,
];

export function CalendarMonth(props: OwnProps) {
    if (!props.isVisible) {
        return <div></div>
    }

    const gridCurrentMonth = calculateMonthGrid(props.date.getFullYear(), props.date.getMonth());
    return <div className="month-grid">
        <div className="month-name">{`${MONTHS[props.date.getMonth()]} ${props.date.getUTCFullYear()}`}</div>
        {gridCurrentMonth.map((week, index) => <WeekRow
            key={index}
            week={week}
            onDayPicked={props.onDayPicked}
            onDaySelected={props.onDaySelected}
            fillDayFilters={props.fillDayFilters}
        />)}</div>
}