import { Box, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { updateActiveDay } from "../../redux/Actions";
import { addDays } from "../../utils/DateUtils";
import Day from "./Day";
import DayDetails from "./DayDetails";
import "./Week.scss";

interface OwnProps {
    firstDayOfWeek: Date;
    children: React.ReactNode;
}

interface ReduxActions {
    updateActiveDay: typeof updateActiveDay;
}

const WEEKDAYS = [Localisation.MONDAY, Localisation.TUESDAY, Localisation.WEDNESDAY, Localisation.THURSDAY, Localisation.FRIDAY, Localisation.SATURDAY, Localisation.SUNDAY];

type Props = OwnProps & ReduxActions;

function Week(props: Props) {
    const [isSmallView] = useMediaQuery("(max-width: 40em)");
    
    return (<Box className='week'>
        {WEEKDAYS.map((day, index) => {
            const date = addDays(props.firstDayOfWeek, index);
            return (<div key={index}>
                <Day date={date} />

                {isSmallView && (<DayDetails date={date}>
                    <div onClick={() => props.updateActiveDay(date.getTime())}>{props.children}</div>
                </DayDetails>)}
            </div>)
        })}
    </Box>)
}

export default connect(null, { updateActiveDay })(Week);