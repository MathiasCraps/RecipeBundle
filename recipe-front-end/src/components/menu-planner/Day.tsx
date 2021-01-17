import { Box, Center, Tooltip, useMediaQuery } from "@chakra-ui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { addMenu } from "../../redux/Actions";
import { DayMenu, ReduxModel } from "../../redux/Store";
import { FULL_DAY_IN_MS } from "../../utils/DateUtils";
import { AddMenyOverlay } from "./AddMenuOverlay";

interface OwnProps {
    date: Date;
    isCurrentDay: boolean;
    dayOfWeek: number;
}

interface ReduxProps {
    menuOfTheDay: DayMenu[];
    recipes: Recipe[];
}

interface ReduxActionProps {
    addMenu: typeof addMenu;
}

function filterForDate(menus: DayMenu[], forDate: Date): DayMenu[] {
    const fromTime = new Date(forDate.getFullYear(), forDate.getMonth(), forDate.getDate()).getTime();
    const toTime = fromTime + FULL_DAY_IN_MS;

    return menus.filter((item) => {
        return item.date >= fromTime && item.date < toTime;
    });
}

function mapStateToProps(reduxStore: ReduxModel, ownProps: OwnProps): ReduxProps {
    return {
        menuOfTheDay: filterForDate(reduxStore.menuPlanning, ownProps.date),
        recipes: reduxStore.recipes
    };
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

function Day(props: Props) {
    const classes = `day ${props.isCurrentDay ? 'current-day' : ''}`;
    const [isSmallView] = useMediaQuery("(max-width: 40em)");
    const dishedDescription = (props.menuOfTheDay.length === 1)
        ? Localisation.DISH_SINGULAR
        : Localisation.DISH_PLURAL
    const hasRecipes = Boolean(props.menuOfTheDay.length);
    const [isOpened, setIsOpened] = useState(false);

    return (<Box className={classes}>
        <Box className='planner-day-display'>{props.date.getDate()}</Box>
        <Box>
            {!isSmallView && (<Tooltip label={props.menuOfTheDay.map((menu) => menu.recipe.title).join('')} fontSize="md">
                <Center>{hasRecipes ? `${props.menuOfTheDay.length} ${dishedDescription.toLowerCase()}` : '-'}</Center>
            </Tooltip>)}

            {isSmallView && (<Center>
                {props.menuOfTheDay.map((menu, index) => <Box key={index}>{menu.recipe.title}</Box>)}
            </Center>)}

            <Center>
                <a href='#' onClick={() => setIsOpened(true)}><FontAwesomeIcon icon={faPlus} />
                    {Localisation.ADD}
                </a>
            </Center>

            <AddMenyOverlay isOpened={isOpened}
                date={props.date}
                recipes={props.recipes}
                onSubmit={(selectedRecipe: Recipe) => {
                    setIsOpened(false);
                    props.addMenu({
                        date: props.date.getTime(),
                        recipe: selectedRecipe
                    });
                }}
                onCancel={() => setIsOpened(false)} />
        </Box>
    </Box>);
}

export default connect(mapStateToProps, { addMenu })(Day);