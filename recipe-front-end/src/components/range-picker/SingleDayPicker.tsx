import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { DateRange } from '../../redux/Store';
import RangePicker from './RangePicker';

interface OwnProps {
    isVisible: boolean;
    onClose: () => void;
    onComplete: (date: Date) => void;
    initialFocusRef: React.Ref<HTMLDivElement>;
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
        fillDayFilters={[]}
    />
    </div>
}