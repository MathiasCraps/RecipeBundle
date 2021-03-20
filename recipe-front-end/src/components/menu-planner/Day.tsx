import { Center, useMediaQuery } from "@chakra-ui/react";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Localisation } from "../../localisation/AppTexts";
import { updateActiveDay, UpdateMenuDayReturn, updatePlannedMenuDay } from "../../redux/Actions";
import { DayMenu, ReduxModel, UpdateActiveDayAction, UpdateMenuDayAction } from "../../redux/Store";
import { filterForDate } from "./MenuPlanner";
import './Day.scss';

interface OwnProps {
    date: Date;
}

interface ReduxProps {
    menuForThisDay: DayMenu[];
    isActiveDay: boolean;
}

interface ReduxActions {
    updateActiveDay: (date: number) => UpdateActiveDayAction;
    updatePlannedMenuDay: UpdateMenuDayReturn;
}

type Props = OwnProps & ReduxProps & ReduxActions;

function mapStateToProps(reduxState: ReduxModel, ownProps: OwnProps): ReduxProps {
    return {
        menuForThisDay: filterForDate(reduxState.menuPlanning, ownProps.date),
        isActiveDay: reduxState.activeDay === ownProps.date.getTime()
    }
}

function mapDispatchToProps(dispatch: Dispatch<UpdateActiveDayAction | UpdateMenuDayAction>): ReduxActions {
    return {
        updateActiveDay: (date: number) => dispatch(updateActiveDay(date)),
        updatePlannedMenuDay: updatePlannedMenuDay(dispatch)
    }
}

function Day(props: Props) {
    const [isAboutToDrop, setIsAboutToDrop] = useState(false);
    const classes = `day ${props.isActiveDay ? 'selected-day' : ''} ${isAboutToDrop ? 'active-drop' : ''}`;
    const [isSmallView] = useMediaQuery("(max-width: 40em)");
    const amountOfRecipes = props.menuForThisDay.length;
    const dishedDescription = (amountOfRecipes === 1)
        ? Localisation.DISH_SINGULAR
        : Localisation.DISH_PLURAL
    const hasRecipes = amountOfRecipes > 0;

    return (<div
        onDragOver={(e) => {
            setIsAboutToDrop(true);
            e.preventDefault();
        }}
        onDragLeave={() => {
            setIsAboutToDrop(false);
        }}
        onDrop={(e) => {
            setIsAboutToDrop(false);
            const menuId = Number(e.dataTransfer.getData('menuId'));
            const dateNumber = props.date.getTime();
            props.updatePlannedMenuDay(menuId, dateNumber);
            props.updateActiveDay(dateNumber);
        }}
        className={classes} 
        onClick={() => props.updateActiveDay(props.date.getTime())}>
        <div className='planner-day-display'>{props.date.getDate()}</div>
        <div>
            <Center className="small-selected-day">
                {!isSmallView && (hasRecipes ? `${amountOfRecipes} ${dishedDescription.toLowerCase()}` : '-')}
            </Center>
        </div>
    </div>);
}

export default connect(mapStateToProps, mapDispatchToProps)(Day);