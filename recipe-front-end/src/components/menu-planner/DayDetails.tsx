import { Heading, Tooltip } from "@chakra-ui/react";
import { faCheckSquare, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { Localisation } from "../../localisation/AppTexts";
import { removeMenu, toggleMenuIngredientsBought, toggleMenuIngredientsBoughtReturn } from "../../redux/Actions";
import { DayMenu, ReduxModel, RemoveMenuAction, ToggleMenuIngredientsBoughtAction } from "../../redux/Store";
import { DroppableMenuItem } from "./DroppableIngredient";
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
    toggleMenuIngredientsBought: toggleMenuIngredientsBoughtReturn;
}

function mapStateToProps(reduxStore: ReduxModel, ownProps: OwnProps): ReduxProps {
    const date = ownProps.date;
    return {
        menuOfTheDay: filterForDate(reduxStore.menuPlanning, date)
    }
}

function mapDispatchToProps(dispatch: Dispatch<RemoveMenuAction | ToggleMenuIngredientsBoughtAction>): ReduxActions {
    return {
        removeMenu: removeMenu(dispatch),
        toggleMenuIngredientsBought: toggleMenuIngredientsBought(dispatch)
    }
}

type Props = OwnProps & ReduxProps & ReduxActions;

function DayDetails(props: Props) {
    return <div className="menu-selected-day">
        <Heading as="h2">{Localisation.MENU_OF_THE_DAY}</Heading>
        {props.menuOfTheDay.length === 0 && <div>{Localisation.NOTHING_PLANNED_TODAY}</div>}
        {props.menuOfTheDay.map((data, index) => {
            return <div key={index}><DroppableMenuItem menu={data}>
                <Tooltip label={Localisation.REMOVE}>
                    <a href="#" onClick={() => props.removeMenu(data)}>
                       <FontAwesomeIcon icon={faTrash} />
                    </a>
                </Tooltip>
            </DroppableMenuItem>
                <Tooltip label={data.ingredientsBought ?
                    Localisation.YOU_HAVE_ALL_INGREDIENTS :
                    Localisation.YOU_DONT_HAVE_ALL_INGREDIENTS
                }>
                    <a href="#" onClick={() => props.toggleMenuIngredientsBought([data], !data.ingredientsBought)}>
                        <FontAwesomeIcon icon={data.ingredientsBought ? faCheckSquare : faTimes} />
                    </a>
                </Tooltip>
            </div>
        })}
        {props.children}
    </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(DayDetails);