import React, { KeyboardEvent, useState } from 'react';
import { DateRange } from '../../redux/Store';
import { dateIsInRange } from '../../utils/DateUtils';
import { FillDayFilter } from './dayfilters/FillDayFilter';
import RangePicker from './RangePicker';

interface OwnProps {
    isVisible: boolean;
    onClose: () => void;
    onComplete: (date: Date) => void;
    initialFocusRef: React.Ref<HTMLDivElement>;
    fillDayFilters: FillDayFilter[];
}

type Props = OwnProps;

export default function SingleDayPicker(props: Props) {
    const [selectedRange, setSelectedRange] = useState<DateRange>({ start: new Date(), end: new Date() });

    function prevent(keyboardEvent: KeyboardEvent<HTMLDivElement>) {
        keyboardEvent.preventDefault();
    }

    return <div onKeyUpCapture={prevent}><RangePicker
        showNextMonth={false}
        isVisible={props.isVisible}
        onClosing={props.onClose}
        onDayPicked={(date: Date) =>  props.onComplete(date)}
        onDaySelected={(date: Date) => setSelectedRange({start: date, end: date})}
        initialFocusRef={props.initialFocusRef}
        activeDay={selectedRange.start}
        selectedRange={selectedRange}
        fillDayFilters={[
            (date: Date) => dateIsInRange(date, selectedRange.start, selectedRange.end), 
            ...props.fillDayFilters
        ]}
    />
    </div>
}