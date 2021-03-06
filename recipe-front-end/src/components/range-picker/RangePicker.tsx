import React, { KeyboardEvent, useState } from 'react';
import { connect } from 'react-redux';
import { updateShoppingRange } from '../../redux/Actions';
import { DateRange, ReduxModel } from '../../redux/Store';
import { addDays, calculateStartOfDate, calculateStartOfMonthWithOffset } from '../../utils/DateUtils';
import { CalendarMonth } from './CalendarMonth';

interface OwnProps {
    showNextMonth: boolean;
    isVisible: boolean;
    onClosing(): void;
}

interface ReduxProps {
    startDate: Date;
    endDate: Date;
}

interface ReduxActions {
    updateShoppingRange: typeof updateShoppingRange;
}

function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        startDate: reduxModel.shoppingDateRange.start,
        endDate: reduxModel.shoppingDateRange.end
    }
}

type Props = OwnProps & ReduxProps & ReduxActions;

enum StageOption {
    START,
    END
}

export const DatePickerContext = React.createContext<DateRange | undefined>(undefined);
function RangePicker(props: Props) {
    if (!props.isVisible) {
        return <div></div>
    }

    const [selection, setSelection] = useState<DateRange | undefined>();
    const [stage, setStage] = useState<StageOption>(StageOption.START);

    function updateClickedRange(date: Date) {
        if (isNaN(+date)) {
            return;
        }

        if (!selection) {
            setSelection({ start: date, end: date });
            setStage(StageOption.END);
        } else {
            const [start, end] = [selection.start, date].sort((a, b) => Number(a) - Number(b));
            setSelection(undefined);
            setStage(StageOption.START);
            props.updateShoppingRange({ start, end });
            props.onClosing();
        }
    }

    function toggleView() {
        if (stage === StageOption.START) {
            setStage(StageOption.START);
        } else if (StageOption.END) {
            setStage(StageOption.START);
            props.onClosing();
        }
    }

    function handleKeyAction(event: KeyboardEvent) {
        const key = event.key;
        if (event.key === 'Escape') {
            setSelection(undefined);
            setStage(StageOption.START);
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

        let assigned: DateRange;
        if (daysToAdd) {
            if (stage === StageOption.START) {
                const baseDateStart: Date = (stage === StageOption.START && selection)
                    ? selection.start
                    : calculateStartOfDate(props.startDate);
                const modified = addDays(baseDateStart, daysToAdd);
                assigned = { start: modified, end: modified };
            } else {
                const baseDateEnd = selection!.end;
                const modified = addDays(baseDateEnd, daysToAdd);
                assigned = { start: selection!.start, end: modified };
            }

            if (assigned) {
                setSelection(assigned);
            }
        }



        if (key === 'Enter') {
            if (selection && stage === StageOption.START) {
                setStage(StageOption.END);
            }

            if (stage === StageOption.END) {
                setStage(StageOption.START);
                setSelection(undefined);
                props.onClosing();
                props.updateShoppingRange(assigned! || selection);
            }
        }
    }

    const months = [
        new Date()
    ]

    if (props.showNextMonth) {
        months.push(calculateStartOfMonthWithOffset(new Date(), 1));
    }

    return <DatePickerContext.Provider value={selection}>
        <div onKeyUpCapture={(event) => {
            handleKeyAction(event);
            if (event.key === 'Enter' && stage === StageOption.START) {
                toggleView()
            }
        }}>
            {months.map((month, index) => {
                return <React.Fragment key={index}><CalendarMonth isVisible={props.isVisible}
                    date={month}
                    onDayPicked={updateClickedRange}
                />
                </React.Fragment>

            })}
        </div>
    </DatePickerContext.Provider>
}

export default connect(mapStateToProps, { updateShoppingRange })(RangePicker);