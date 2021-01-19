import { Heading } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { DayMenu } from "../../redux/Store";

interface Props {
    menu: DayMenu[];
    children: React.ReactNode;
}

function DayDetails(props: Props) {
    return <div className="menu-selected-day">
        <Heading as="h2">{Localisation.MENU_OF_THE_DAY}</Heading>
        {props.menu.length === 0 && <div>{Localisation.NOTHING_PLANNED_TODAY}</div>}
        {props.menu.map((data, index) => {
            return <div key={index}>{data.recipe.title}</div>
        })}
        {props.children}
    </div>
}

export default connect(null, null)(DayDetails);