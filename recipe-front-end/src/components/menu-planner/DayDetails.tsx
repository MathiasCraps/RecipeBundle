import { Heading } from "@chakra-ui/react";
import React from "react";
import { connect } from 'react-redux';
import { Localisation } from "../../localisation/AppTexts";
import { DayMenu, ReduxModel } from "../../redux/Store";
import DroppableMenuItem from "./DroppableMenuItem";
import { filterForDate } from "./MenuPlanner";

interface OwnProps {
    children: React.ReactNode;
    date: Date;
}

interface ReduxProps {
    menuOfTheDay: DayMenu[];
}

function mapStateToProps(reduxStore: ReduxModel, ownProps: OwnProps): ReduxProps {
    const date = ownProps.date;
    return {
        menuOfTheDay: filterForDate(reduxStore.menuPlanning, date)
    }
}

type Props = OwnProps & ReduxProps;

function DayDetails(props: Props) {
    return <div className="menu-selected-day">
        <Heading as="h2">{Localisation.MENU_OF_THE_DAY}</Heading>
        {props.menuOfTheDay.length === 0 && <div>{Localisation.NOTHING_PLANNED_TODAY}</div>}
        {props.menuOfTheDay.map((menu, index) => {
            return <div key={index}><DroppableMenuItem menu={menu}/>
            </div>
        })}
        {props.children}
    </div>
}

export default connect(mapStateToProps)(DayDetails);