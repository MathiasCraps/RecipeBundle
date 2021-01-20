import { Center, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { connect } from "react-redux";
import { Localisation } from "../../localisation/AppTexts";
import { addMenu } from "../../redux/Actions";

interface OwnProps {
    date: Date;
    isCurrentDay: boolean;
    amountOfRecipes: number;
    onFocus(): void;
}

interface ReduxActionProps {
    addMenu: typeof addMenu;
}

type Props = OwnProps & ReduxActionProps;

function Day(props: Props) {
    const classes = `day ${props.isCurrentDay ? 'selected-day' : ''}`;
    const [isSmallView] = useMediaQuery("(max-width: 40em)");
    const dishedDescription = (props.amountOfRecipes === 1)
        ? Localisation.DISH_SINGULAR
        : Localisation.DISH_PLURAL
    const hasRecipes = props.amountOfRecipes > 0;

    return (<div className={classes} onMouseEnter={() => props.onFocus()}>
        <div className='planner-day-display'>{props.date.getDate()}</div>
        <div>
            <Center className="small-selected-day">
                {!isSmallView && (hasRecipes ? `${props.amountOfRecipes} ${dishedDescription.toLowerCase()}` : '-')}
            </Center>
        </div>
    </div>);
}

export default connect(null, { addMenu })(Day);