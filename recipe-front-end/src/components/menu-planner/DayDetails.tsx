import { Heading, Tooltip } from "@chakra-ui/react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Localisation } from "../../localisation/AppTexts";
import { removeMenu } from "../../redux/Actions";
import { DayMenu, RemoveMenuAction } from "../../redux/Store";

interface OwnProps {
    menu: DayMenu[];
    children: React.ReactNode;
}

interface ReduxProps {
    removeMenu: (menu: DayMenu) => void;
}

function mapDispatchToProps(dispatch: Dispatch<RemoveMenuAction>): ReduxProps {
    return {
        removeMenu: removeMenu(dispatch)
    }
}


type Props = OwnProps & ReduxProps;

function DayDetails(props: Props) {
    return <div className="menu-selected-day">
        <Heading as="h2">{Localisation.MENU_OF_THE_DAY}</Heading>
        {props.menu.length === 0 && <div>{Localisation.NOTHING_PLANNED_TODAY}</div>}
        {props.menu.map((data, index) => {
            return <div key={index}>{data.recipe.title}
                <Tooltip label={Localisation.REMOVE}>
                    <a href="#" onClick={() => props.removeMenu(data)}><FontAwesomeIcon icon={faTrash} /></a>
                </Tooltip>
            </div>
        })}
        {props.children}
    </div>
}

export default connect(null, mapDispatchToProps)(DayDetails);