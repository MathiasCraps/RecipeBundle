import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { DateRange } from '../../redux/Store';
import RangePicker from './RangePicker';

interface OwnProps {
    isVisible: boolean;
    onClose: () => void;
    onComplete: (date: Date) => void;
}

type Props = OwnProps;

export default function SingleDayPicker(props: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [selectedRange, setSelectedRange] = useState<DateRange>({ start: new Date(), end: new Date() });

    function prevent(keyboardEvent: KeyboardEvent<HTMLDivElement>) {
        keyboardEvent.preventDefault();
    }

    useEffect(() => {
        ref.current?.focus();
    });

    return <div onKeyUpCapture={prevent}><RangePicker
        showNextMonth={false}
        isVisible={props.isVisible}
        onClosing={props.onClose}
        onDayPicked={(date: Date) =>  props.onComplete(date)}
        onDaySelected={(date: Date) => setSelectedRange({start: date, end: date})}
        initialFocusRef={ref}
        activeDay={selectedRange.start}
        selectedRange={selectedRange}
    />
    </div>
}