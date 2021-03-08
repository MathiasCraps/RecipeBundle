
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { updateShoppingRange } from '../../redux/Actions';
import { DateRange } from '../../redux/Store';
import RangePicker from './RangePicker';


interface Ownprops {
    isVisible: boolean;
    onClosing(): void;
    showNextMonth: boolean;
    initialFocusRef: React.Ref<HTMLDivElement>;
}

interface ReduxActions {
    updateShoppingRange: typeof updateShoppingRange;
}

type Props = Ownprops & ReduxActions;

enum StageOption {
    START,
    END
}

function MultiRangePicker(props: Props) {
    if (!props.isVisible) {
        return <></>;
    }

    const [selection, setSelection] = useState<DateRange>({start: new Date(), end: new Date()});
    const [stage, setStage] = useState<StageOption>(StageOption.START);
    const [selectedDay, setSelectedDay] = useState(new Date());

    function handleDayUpdated(date: Date) {
        if (stage === StageOption.START) {
            setStage(StageOption.END);
        } else {
            props.updateShoppingRange({ start: selection.start, end: date});
            setSelection({start: new Date(), end: new Date()});
            props.onClosing();
            setStage(StageOption.START);
        }
    }

    function handleDaySelected(date: Date) {
        setSelectedDay(date);
        if (stage === StageOption.START) {
            setSelection({ start: date, end: date});
        } else {
            setSelection({start: selection.start, end: date});
        }
    }

    function handleClose() {
        setStage(StageOption.START);
        setSelection({start: new Date(), end: new Date()});
        props.onClosing();
    }

    return <RangePicker
        showNextMonth={props.showNextMonth} 
        isVisible={props.isVisible} 
        onClosing={handleClose} 
        onDayPicked={handleDayUpdated}
        onDaySelected={handleDaySelected}
        selectedRange={selection}
        activeDay={selectedDay}
        initialFocusRef={props.initialFocusRef}
    />
}

export default connect(null, { updateShoppingRange })(MultiRangePicker);