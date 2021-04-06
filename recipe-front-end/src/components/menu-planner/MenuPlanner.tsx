import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { updateActiveDay } from '../../redux/Actions';
import { DayMenu, ReduxModel } from "../../redux/Store";
import { addDays, calculateStartOfDate, clipDate, FULL_DAY_IN_MS, normalizeWeekDay } from "../../utils/DateUtils";
import ContentContainer from "../common/ContentContainer";
import AddMenuOverlay from "./AddMenuOverlay";
import DayDetails from "./DayDetails";
import Week from "./Week";

interface ReduxProps {
    activeDay: number | undefined;
    isLoggedIn: boolean
}

interface ReduxActions {
    updateActiveDay: typeof updateActiveDay;
}

function mapStateToProps(reduxStore: ReduxModel): ReduxProps {
    return {
        isLoggedIn: reduxStore.user.loggedIn,
        activeDay: reduxStore.activeDay
    }
}

type Props = ReduxProps & ReduxActions;

export function filterForDate(menus: DayMenu[], forDate: Date): DayMenu[] {
    const fromTime = new Date(forDate.getFullYear(), forDate.getMonth(), forDate.getDate()).getTime();
    const toTime = fromTime + FULL_DAY_IN_MS;

    return menus.filter((item) => {
        return item.date >= fromTime && item.date < toTime;
    });
}

function MenuPlanner(props: Props) {
    if (!props.isLoggedIn) {
        return <Redirect to={Paths.BASE} />
    }

    const currentDay = calculateStartOfDate(new Date());
    const currentWeekDay = normalizeWeekDay(currentDay.getUTCDay());
    const firstDayOfCurrentWeek = addDays(currentDay, -currentWeekDay);
    const firstDayOfNextWeek = addDays(firstDayOfCurrentWeek, 7);
    const maximumRange = addDays(firstDayOfCurrentWeek, 14);
    const [isSmallView] = useMediaQuery("(max-width: 40em)");
    const [isOpened, setIsOpened] = useState(false);
    const currentDayFocus = useRef<HTMLAnchorElement>(null);
    const addRecipeButton = <a ref={currentDayFocus} className="add-menu" href='#' onClick={() => setIsOpened(true)}>
        <FontAwesomeIcon icon={faPlus} /> {Localisation.ADD}
    </a>

    useEffect(() => {
        function switchDay(event: KeyboardEvent) {
            if (isOpened) {
                return;
            }

            let activeDay = props.activeDay ? new Date(props.activeDay) : firstDayOfCurrentWeek;
            if (event.code === 'ArrowLeft') {
                activeDay = clipDate(addDays(activeDay, -1), firstDayOfCurrentWeek, Math.max);
            } else if (event.code === 'ArrowRight') {
                activeDay = clipDate(addDays(activeDay, 1), maximumRange, Math.min);
            } else {
                return;
            }

            currentDayFocus.current?.focus();
            props.updateActiveDay(activeDay.getTime());
        }

        document.body.addEventListener('keyup', switchDay);

        return (() => {
            document.body.removeEventListener('keyup', switchDay);
        })
    })

    return (<ContentContainer>
        <Heading as="h2">{Localisation.MENU_PLANNER}</Heading>

        <Week firstDayOfWeek={firstDayOfCurrentWeek}>{addRecipeButton}</Week>
        <Week firstDayOfWeek={firstDayOfNextWeek}>{addRecipeButton}</Week>

        <Box>
            {!isSmallView && props.activeDay && <DayDetails date={new Date(props.activeDay)} >
                {addRecipeButton}
            </DayDetails>}

            <AddMenuOverlay isOpened={isOpened}
                onSubmit={() => {
                    setIsOpened(false);
                }}
                onCancel={() => setIsOpened(false)} />
        </Box>
    </ContentContainer>)
}


export default connect(mapStateToProps, { updateActiveDay })(MenuPlanner);