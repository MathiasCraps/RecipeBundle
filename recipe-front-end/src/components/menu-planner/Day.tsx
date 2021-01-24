import { Center, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { updateActiveDay } from "../../redux/Actions";
import { DayMenu, ReduxModel } from "../../redux/Store";
import { filterForDate } from "./MenuPlanner";

interface OwnProps {
    date: Date;
}

interface ReduxProps {
    menuForThisDay: DayMenu[];
    isActiveDay: boolean;
}

interface ReduxActions {
    updateActiveDay: typeof updateActiveDay;
}

type Props = OwnProps & ReduxProps & ReduxActions;

function mapStateToProps(reduxState: ReduxModel, ownProps: OwnProps): ReduxProps {
    return {
        menuForThisDay: filterForDate(reduxState.menuPlanning, ownProps.date),
        isActiveDay: reduxState.activeDay === ownProps.date.getTime()
    }
}

function Day(props: Props) {
    const classes = `day ${props.isActiveDay ? 'selected-day' : ''}`;
    const [isSmallView] = useMediaQuery("(max-width: 40em)");
    const amountOfRecipes = props.menuForThisDay.length;
    const dishedDescription = (amountOfRecipes === 1)
        ? Localisation.DISH_SINGULAR
        : Localisation.DISH_PLURAL
    const hasRecipes = amountOfRecipes > 0;

    return (<div className={classes} onMouseEnter={() => props.updateActiveDay(props.date.getTime())}>
        <div className='planner-day-display'>{props.date.getDate()}</div>
        <div>
            <Center className="small-selected-day">
                {!isSmallView && (hasRecipes ? `${amountOfRecipes} ${dishedDescription.toLowerCase()}` : '-')}
            </Center>
        </div>
    </div>);
}

export default connect(mapStateToProps, { updateActiveDay })(Day);