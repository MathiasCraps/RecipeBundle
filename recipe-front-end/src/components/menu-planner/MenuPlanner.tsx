import { Box, CloseButton, Heading, SlideFade } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { changeActiveView } from '../../redux/Actions';
import { ReduxModel, ViewType } from "../../redux/Store";
import { calculateStartOfDate, FULL_DAY_IN_MS } from "../../utils/DateUtils";
import Day from "./Day";

interface OwnProps {
    loggedIn: boolean;
}

interface ReduxProps {
    changeActiveView: typeof changeActiveView;
}

function mapStateToProps(store: ReduxModel): OwnProps {
    return {
        loggedIn: store.user.loggedIn
    }
}

const WEEKDAYS = [Localisation.MONDAY, Localisation.TUESDAY, Localisation.WEDNESDAY, Localisation.THURSDAY, Localisation.FRIDAY, Localisation.SATURDAY, Localisation.SUNDAY];

type Props = OwnProps & ReduxProps;

function MenuPlanner(props: Props) {
    const currentDay = calculateStartOfDate(new Date());
    const rawCurrentDay = currentDay.getDay();
    const currentWeekDay = rawCurrentDay === 0 ? 6 : currentDay.getDay() - 1;
    const firstDayOfCurrentWeek = currentDay.getTime() - (FULL_DAY_IN_MS * currentWeekDay);

    return (<Box>
        <CloseButton className="close-button-top-left" autoFocus={true} size="md" onClick={() => props.changeActiveView(ViewType.Overview, undefined)} />
        <SlideFade in={true}>
            <Box className="week-planner-menu" padding="2em" maxWidth="80em">
                <Heading as="h2">{Localisation.MENU_PLANNER}</Heading>
                <Box className='week'>
                    {WEEKDAYS.map((day, index) => {
                        const date = new Date(firstDayOfCurrentWeek + (FULL_DAY_IN_MS * index));
                        return (<Day
                            key={index}
                            date={date}
                            dayOfWeek={index}
                            isCurrentDay={index === currentWeekDay}
                        />)
                    })}
                </Box>
            </Box>
        </SlideFade>
    </Box>)
}


export default connect(mapStateToProps, { changeActiveView })(MenuPlanner);