import { Heading, Tooltip } from "@chakra-ui/react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Localisation } from "../../localisation/AppTexts";
import { removeMenu } from "../../redux/Actions";
import { DayMenu, ReduxModel, RemoveMenuAction } from "../../redux/Store";
import { filterForDate } from "./MenuPlanner";

interface OwnProps {
    children: React.ReactNode;
    date: Date;
}

interface ReduxProps {
    menuOfTheDay: DayMenu[];
}

interface ReduxActions {
    removeMenu: (menu: DayMenu) => void;
}

function mapStateToProps(reduxStore: ReduxModel, ownProps: OwnProps): ReduxProps {
    const date = ownProps.date;
    return {
        menuOfTheDay: filterForDate(reduxStore.menuPlanning, date)
    }
}

function mapDispatchToProps(dispatch: Dispatch<RemoveMenuAction>): ReduxActions {
    return {
        removeMenu: removeMenu(dispatch)
    }
}


type Props = OwnProps & ReduxProps & ReduxActions;

function DayDetails(props: Props) {
    return <div className="menu-selected-day">
        <Heading as="h2">{Localisation.MENU_OF_THE_DAY}</Heading>
        {props.menuOfTheDay.length === 0 && <div>{Localisation.NOTHING_PLANNED_TODAY}</div>}
        {props.menuOfTheDay.map((data, index) => {
            return <div key={index}>{data.recipe.title}
                <Tooltip label={Localisation.REMOVE}>
                    <a href="#" onClick={() => props.removeMenu(data)}><FontAwesomeIcon icon={faTrash} /></a>
                </Tooltip>
            </div>
        })}
        {props.children}
    </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(DayDetails);