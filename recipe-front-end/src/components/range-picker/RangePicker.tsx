import React, { KeyboardEvent, useState } from 'react';
import { DateRange } from '../../redux/Store';
import { addDays, calculateStartOfMonthWithOffset } from '../../utils/DateUtils';
import { CalendarMonth } from './CalendarMonth';

interface OwnProps {
    showNextMonth: boolean;
    isVisible: boolean;
    onClosing(): void;
    onDayPicked(date: Date): void;
    onDaySelected(date: Date): void;
    selectedRange: DateRange;
    activeDay: Date;
    initialFocusRef: React.Ref<HTMLDivElement>;
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
        }

        let assigned: Date;
        
        if (daysToAdd) {
            assigned = addDays(props.activeDay, daysToAdd)
            props.onDaySelected(assigned);
        }



        if (key === 'Enter' && initialOpen) {
            props.onDayPicked(props.activeDay);
        }

        if (!initialOpen) {
            setIntialOpen(true);
        }
    }

    const months = [
        new Date()
    ]

    if (props.showNextMonth) {
        months.push(calculateStartOfMonthWithOffset(new Date(), 1));
    }

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
                />
                </React.Fragment>

            })}
        </div>
    </DatePickerContext.Provider>
}
