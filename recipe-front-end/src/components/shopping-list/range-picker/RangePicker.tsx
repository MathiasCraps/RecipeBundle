import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Localisation } from '../../../localisation/AppTexts';
import { updateShoppingRange } from '../../../redux/Actions';
import { DateRange, ReduxModel } from '../../../redux/Store';
import { addDays, calculateStartOfDate } from '../../../utils/DateUtils';
import { CalendarMonth } from './CalendarMonth';

interface ReduxProps {
    startDate: Date;
    endDate: Date;
}

interface ReduxActions {
    updateShoppingRange: typeof updateShoppingRange;
}

function formatDate(date: Date) {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        startDate: reduxModel.shoppingDateRange.start,
        endDate: reduxModel.shoppingDateRange.end
    }
}

type Props = ReduxProps & ReduxActions;

enum StageOption {
    NONE,
    START,
    END
}

export const DatePickerContext = React.createContext<DateRange | undefined>(undefined);
function RangePicker(props: Props) {
    const [selection, setSelection] = useState<DateRange | undefined>();
    const [isVisible, setIsvisible] = useState(false);
    const [stage, setStage] = useState<StageOption>(StageOption.NONE);

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
            setIsvisible(false);
            setStage(StageOption.NONE);
            props.updateShoppingRange({ start, end });
        }
    }

    function toggleView() {
        if (!isVisible) {
            setStage(StageOption.START);
        } else if (StageOption.END) {
            setStage(StageOption.NONE);
        }

        setIsvisible(!isVisible);
    }

    function handleKeyAction(event: KeyboardEvent) {
        if (!isVisible) {
            return;
        }

        const key = event.key;
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
                let baseDateStart: Date = (stage === StageOption.START && selection)
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
                setIsvisible(false);
                setStage(StageOption.NONE);
                setSelection(undefined);
                props.updateShoppingRange(assigned! || selection);
            }
        }
    }

    return <DatePickerContext.Provider value={selection}>
        <div onKeyUpCapture={(event) => {
            handleKeyAction(event);
            if (event.key === 'Enter' && !isVisible) {
                toggleView()
            }
        }}>
            <p>{Localisation.YOUR_SHOPPING_LIST_FOR_THE_PERIOD} <a
                href="#"
                className="date-range-initiator"
                tabIndex={0}
                onMouseUp={toggleView}>{formatDate(props.startDate)} - {formatDate(props.endDate)}
            </a>:</p>
            <CalendarMonth isVisible={isVisible}
                date={new Date()}
                onDayPicked={updateClickedRange}
            />
        </div>
    </DatePickerContext.Provider>
}

export default connect(mapStateToProps, { updateShoppingRange })(RangePicker);