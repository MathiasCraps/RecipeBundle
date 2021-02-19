import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Localisation } from '../../../localisation/AppTexts';
import { updateShoppingRange } from '../../../redux/Actions';
import { ReduxModel } from '../../../redux/Store';
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

export const DatePickerContext = React.createContext<Date | undefined>(undefined);
function RangePicker(props: Props) {
    function updateRange(date: Date) {
        if(isNaN(+date)) {
            return;
        }

        if (!selection) {
            setSelection(date);
        } else {
            const [start, end] = [selection, date].sort((a, b) => Number(a) - Number(b));
            setSelection(undefined);
            setIsvisible(false);
            props.updateShoppingRange({start, end});
        }
    }

    const [selection, setSelection] = useState<Date>();
    const [isVisible, setIsvisible] = useState(false);

    return <DatePickerContext.Provider value={selection}>
        <p>{Localisation.YOUR_SHOPPING_LIST_FOR_THE_PERIOD} <a
            href="#"
            className="date-range-initiator"
            tabIndex={0}
            onClick={() => setIsvisible(!isVisible)}>{formatDate(props.startDate)} - {formatDate(props.endDate)}
        </a>:</p>
        <CalendarMonth isVisible={isVisible}
            date={new Date()}
            onDayPicked={updateRange}
        />
    </DatePickerContext.Provider>
}

export default connect(mapStateToProps, { updateShoppingRange })(RangePicker);