import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { updateActiveDay } from '../../redux/Actions';
import { DayMenu, ReduxModel } from "../../redux/Store";
import { calculateStartOfDate, FULL_DAY_IN_MS } from "../../utils/DateUtils";
import ContentContainer from "../common/ContentContainer";
import AddMenuOverlay from "./AddMenuOverlay";
import DayDetails from "./DayDetails";
import Week from "./Week";
import { Redirect } from "react-router-dom";

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
    const rawCurrentDay = currentDay.getDay();
    const currentWeekDay = rawCurrentDay === 0 ? 6 : currentDay.getDay() - 1;
    const firstDayOfCurrentWeek = currentDay.getTime() - (FULL_DAY_IN_MS * currentWeekDay);
    const firstDayOfNextWeek = firstDayOfCurrentWeek + (FULL_DAY_IN_MS * 7);
    const maximumRange = firstDayOfCurrentWeek + (FULL_DAY_IN_MS * 14);
    const [isSmallView] = useMediaQuery("(max-width: 40em)");
    const [isOpened, setIsOpened] = useState(false);
    const currentDayFocus = useRef<HTMLAnchorElement>(null);
    const addRecipeButton = <a ref={currentDayFocus} href='#' onClick={() => setIsOpened(true)}>
        <FontAwesomeIcon icon={faPlus} /> {Localisation.ADD}
    </a>

    useEffect(() => {
        function switchDay(event: KeyboardEvent) {
            if (isOpened) {
                return;
            }

            let activeDay = props.activeDay || firstDayOfCurrentWeek;
            if (event.code === 'ArrowLeft') {
                activeDay = Math.max(activeDay - FULL_DAY_IN_MS, firstDayOfCurrentWeek);
            } else if (event.code === 'ArrowRight') {
                activeDay = Math.min(activeDay + FULL_DAY_IN_MS, maximumRange);
            } else {
                return;
            }

            currentDayFocus.current?.focus();
            props.updateActiveDay(activeDay);
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
            {!isSmallView && props.activeDay && <DayDetails date={new Date(new Date(props.activeDay))} >
                {addRecipeButton}
            </DayDetails>}

            <AddMenuOverlay isOpened={isOpened}
                onSubmit={(selectedRecipe: Recipe) => {
                    setIsOpened(false);
                }}
                onCancel={() => setIsOpened(false)} />
        </Box>
    </ContentContainer>)
}


export default connect(mapStateToProps, { updateActiveDay })(MenuPlanner);