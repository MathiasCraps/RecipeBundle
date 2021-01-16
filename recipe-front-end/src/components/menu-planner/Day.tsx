import { Box, Center, Tooltip, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { DayMenu, ReduxModel } from "../../redux/Store";

interface OwnProps {
    date: Date;
    isCurrentDay: boolean;
    dayOfWeek: number;
}

interface ReduxProps {
    menuOfTheDay: DayMenu[];
}

function filterForDate(menus: DayMenu[], forDate: Date): DayMenu[] {
    const fromTime = new Date(forDate.getFullYear(), forDate.getMonth(), forDate.getDate()).getTime();
    const toTime = fromTime + (24 * 60 * 60 * 1e3);

    return menus.filter((item) => {
        return item.date >= fromTime && item.date < toTime;
    })
}

function mapStateToProps(reduxStore: ReduxModel, ownProps: OwnProps): ReduxProps {
    return {
        menuOfTheDay: filterForDate(reduxStore.menuPlanning, ownProps.date)
    };
}

type Props = OwnProps & ReduxProps;

function Day(props: Props) {
    const classes = `day ${props.isCurrentDay ? 'current-day' : ''}`;
    const [isSmallView] = useMediaQuery("(max-width: 40em)");
    const dishedDescription = (props.menuOfTheDay.length === 1)
        ? Localisation.DISH_SINGULAR
        : Localisation.DISH_PLURAL
    const hasRecipes = Boolean(props.menuOfTheDay.length);

    return (<Box className={classes}>
        <Box className='planner-day-display'>{props.date.getDate()}</Box>
        <Box>
            {!isSmallView && (<Tooltip label={props.menuOfTheDay.map((menu) => menu.recipe.title).join('')} fontSize="md">
                <Center>{hasRecipes ? `${props.menuOfTheDay.length} ${dishedDescription.toLowerCase()}` : '-'}</Center>
            </Tooltip>)}

            {isSmallView && (<Center>
                {props.menuOfTheDay.map((menu, index) => <Box key={index}>{menu.recipe.title}</Box>)}
            </Center>)}
        </Box>
    </Box>);
}

export default connect(mapStateToProps, null)(Day);