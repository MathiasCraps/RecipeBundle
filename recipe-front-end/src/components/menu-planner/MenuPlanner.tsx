import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { addMenu, changeActiveView } from '../../redux/Actions';
import { DayMenu, ReduxModel } from "../../redux/Store";
import { calculateStartOfDate, FULL_DAY_IN_MS } from "../../utils/DateUtils";
import ContentContainer from "../common/ContentContainer";
import { AddMenyOverlay } from "./AddMenuOverlay";
import Day from "./Day";
import DayDetails from "./DayDetails";

interface OwnProps {
    loggedIn: boolean;
    menus: DayMenu[];
    recipes: Recipe[];
}

interface ReduxProps {
    changeActiveView: typeof changeActiveView;
    addMenu: typeof addMenu;
}

function mapStateToProps(store: ReduxModel): OwnProps {
    return {
        loggedIn: store.user.loggedIn,
        menus: store.menuPlanning,
        recipes: store.recipes
    }
}

function filterForDate(menus: DayMenu[], forDate: Date): DayMenu[] {
    const fromTime = new Date(forDate.getFullYear(), forDate.getMonth(), forDate.getDate()).getTime();
    const toTime = fromTime + FULL_DAY_IN_MS;

    return menus.filter((item) => {
        return item.date >= fromTime && item.date < toTime;
    });
}

const WEEKDAYS = [Localisation.MONDAY, Localisation.TUESDAY, Localisation.WEDNESDAY, Localisation.THURSDAY, Localisation.FRIDAY, Localisation.SATURDAY, Localisation.SUNDAY];

type Props = OwnProps & ReduxProps;

function MenuPlanner(props: Props) {
    const currentDay = calculateStartOfDate(new Date());
    const rawCurrentDay = currentDay.getDay();
    const currentWeekDay = rawCurrentDay === 0 ? 6 : currentDay.getDay() - 1;
    const firstDayOfCurrentWeek = currentDay.getTime() - (FULL_DAY_IN_MS * currentWeekDay);
    const [focusedDay, setFocusedDay] = useState(0);
    const calculatedFocusedDay = firstDayOfCurrentWeek + (focusedDay * FULL_DAY_IN_MS);
    const focusedRecipes = filterForDate(props.menus, new Date(calculatedFocusedDay));
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

            let newIndex = focusedDay;
            if (event.code === 'ArrowLeft') {
                newIndex = Math.max(newIndex - 1, 0);
            } else if (event.code === 'ArrowRight') {
                newIndex = Math.min(newIndex + 1, 6);
            } else {
                return;
            }

            currentDayFocus.current!.focus();
            setFocusedDay(newIndex);
        }

        document.body.addEventListener('keyup', switchDay);

        return (() => {
            document.body.removeEventListener('keyup', switchDay);
        })
    })

    return (<ContentContainer>
        <Heading as="h2">{Localisation.MENU_PLANNER}</Heading>
        <Box className='week'>
            {WEEKDAYS.map((day, index) => {
                const date = new Date(firstDayOfCurrentWeek + (FULL_DAY_IN_MS * index));
                const menu = filterForDate(props.menus, date);
                return (<div key={index}><Day
                    date={date}
                    amountOfRecipes={menu.length}
                    onFocus={() => {
                        setFocusedDay(index);
                    }}
                    isCurrentDay={focusedDay === index} />

                    {isSmallView && (<DayDetails menu={menu} >
                        <div onClick={() => setFocusedDay(index)}>{addRecipeButton}</div>
                    </DayDetails>)}
                </div>)
            })}
        </Box>
        <Box>
            {!isSmallView && <DayDetails menu={focusedRecipes} >
                {addRecipeButton}
            </DayDetails>}

            <AddMenyOverlay isOpened={isOpened}
                date={new Date(calculatedFocusedDay)}
                recipes={props.recipes}
                onSubmit={(selectedRecipe: Recipe) => {
                    setIsOpened(false);
                    props.addMenu({
                        date: calculatedFocusedDay,
                        recipe: selectedRecipe
                    });
                }}
                onCancel={() => setIsOpened(false)} />
        </Box>
    </ContentContainer>)
}


export default connect(mapStateToProps, { changeActiveView, addMenu })(MenuPlanner);