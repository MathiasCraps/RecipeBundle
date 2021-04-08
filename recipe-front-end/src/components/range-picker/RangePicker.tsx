import React, { KeyboardEvent, useState } from 'react';
import { DateRange } from '../../redux/Store';
import { addDays, calculateStartOfMonthWithOffset, clipDate, FULL_DAY_IN_MS } from '../../utils/DateUtils';
import { CalendarMonth } from './CalendarMonth';
import { FillDayFilter } from './dayfilters/FillDayFilter';

interface OwnProps {
    showNextMonth: boolean;
    isVisible: boolean;
    onClosing(): void;
    onDayPicked(date: Date): void;
    onDaySelected(date: Date): void;
    selectedRange: DateRange;
    activeDay: Date;
    initialFocusRef: React.Ref<HTMLDivElement>;
    fillDayFilters: FillDayFilter[];
}

type Props = OwnProps;

export const DatePickerContext = React.createContext<DateRange | undefined>(undefined);
export default function RangePicker(props: Props) {
    if (!props.isVisible) {
        return <div></div>
    }

    const [initialOpen, setIntialOpen] = useState(false);
    
    function handleKeyAction(event: KeyboardEvent) {
        const key = event.key;
        if (event.key === 'Escape') {
            props.onClosing();
            return;
        }

        let daysToAdd = 0;
        switch (key) {
            case 'ArrowLeft':
                daysToAdd = -1;
                break;
            case 'ArrowRight':
                daysToAdd = 1;
                break;
            case 'ArrowUp':
                daysToAdd = -7;
                break;
            case 'ArrowDown':
                daysToAdd = 7;
                break;
            default:
                // ignore
        }

        let calculatedNewDay: Date;
        
        if (daysToAdd) {
            calculatedNewDay = addDays(props.activeDay, daysToAdd);
            const clippedDate = clipDate(calculatedNewDay, months[0], endRange);
            props.onDaySelected(clippedDate);
        }

        if (key === 'Enter' && initialOpen) {
            props.onDayPicked(props.activeDay);
        }

        if (!initialOpen) {
            setIntialOpen(true);
        }
    }

    const months = [
        calculateStartOfMonthWithOffset(new Date(), 0)
    ]

    if (props.showNextMonth) {
        months.push(calculateStartOfMonthWithOffset(months[0], 1));
    }

    const endRange = new Date(calculateStartOfMonthWithOffset(months[months.length - 1], 1).getTime() - FULL_DAY_IN_MS);

    return <DatePickerContext.Provider value={props.selectedRange}>
        <div className="date-picker" tabIndex={-1} ref={props.initialFocusRef} onKeyUpCapture={(event) => {
            handleKeyAction(event);
        }}>
            {months.map((month, index) => {
                return <React.Fragment key={index}><CalendarMonth 
                    isVisible={props.isVisible}
                    onDaySelected={props.onDaySelected}
                    date={month}
                    onDayPicked={props.onDayPicked}
                    fillDayFilters={props.fillDayFilters}
                />
                </React.Fragment>

            })}
        </div>
    </DatePickerContext.Provider>
}
