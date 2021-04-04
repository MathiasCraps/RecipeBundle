import { Center, useMediaQuery } from "@chakra-ui/react";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Localisation } from "../../localisation/AppTexts";
import { updateActiveDay, UpdateMenuDayReturn, updatePlannedMenuDay } from "../../redux/Actions";
import { DayMenu, ReduxModel, UpdateActiveDayAction, UpdateMenuDayAction } from "../../redux/Store";
import { filterForDate } from "./MenuPlanner";
import './Day.scss';
import { normalizeWeekDay } from '../../utils/DateUtils';

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

const DAY_LOCALS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
const MONTH_LOCALS = ['jan', 'feb', 'maa', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

function Day(props: Props) {
    const [isAboutToDrop, setIsAboutToDrop] = useState(false);
    const classes = `day ${props.isActiveDay ? 'selected-day' : ''} ${isAboutToDrop ? 'active-drop' : ''}`;
    const [isSmallView] = useMediaQuery("(max-width: 40em)");
    const amountOfRecipes = props.menuForThisDay.length;
    const dishedDescription = (amountOfRecipes === 1)
        ? Localisation.DISH_SINGULAR
        : Localisation.DISH_PLURAL
    const hasRecipes = amountOfRecipes > 0;
    const dayOfWeek = normalizeWeekDay(props.date.getUTCDay());

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
        <div className='planner-day-display'>
            <div className='localized-day'>{DAY_LOCALS[dayOfWeek]}</div>
            <div className='date-group'>
                <span className='date'>{props.date.getDate()}</span>
                <span className='month'> {MONTH_LOCALS[props.date.getUTCMonth()]}</span>
            </div>
        </div>
        <div>
            <Center className="small-selected-day">
                {!isSmallView && (hasRecipes ? `${amountOfRecipes} ${dishedDescription.toLowerCase()}` : '-')}
            </Center>
        </div>
    </div>);
}

export default connect(mapStateToProps, mapDispatchToProps)(Day);