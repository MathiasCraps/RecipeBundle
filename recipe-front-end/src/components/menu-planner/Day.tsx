import { Tooltip, useMediaQuery } from "@chakra-ui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { addMenu } from "../../redux/Actions";
import { DayMenu, ReduxModel } from "../../redux/Store";
import { AddMenyOverlay } from "./AddMenuOverlay";

interface OwnProps {
    date: Date;
    isCurrentDay: boolean;
    dayOfWeek: number;
    menuOfTheDay: DayMenu[];
    onFocus(): void;
}

interface ReduxProps {
    recipes: Recipe[];
}

interface ReduxActionProps {
    addMenu: typeof addMenu;
}


function mapStateToProps(reduxStore: ReduxModel, ownProps: OwnProps): ReduxProps {
    return {
        recipes: reduxStore.recipes
    };
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

function Day(props: Props) {
    const classes = `day ${props.isCurrentDay ? 'selected-day' : ''}`;
    const [isSmallView] = useMediaQuery("(max-width: 40em)");
    const dishedDescription = (props.menuOfTheDay.length === 1)
        ? Localisation.DISH_SINGULAR
        : Localisation.DISH_PLURAL
    const hasRecipes = Boolean(props.menuOfTheDay.length);
    const [isOpened, setIsOpened] = useState(false);

    return (<div className={classes} onMouseEnter={() => props.onFocus()}>
        <div className='planner-day-display'>{props.date.getDate()}</div>
        <div>
            {!isSmallView && (<Tooltip label={props.menuOfTheDay.map((menu) => menu.recipe.title).join('')} fontSize="md">
                {hasRecipes ? `${props.menuOfTheDay.length} ${dishedDescription.toLowerCase()}` : '-'}
            </Tooltip>)}

            {isSmallView && (<div>
                {props.menuOfTheDay.map((menu, index) => <div key={index}>{menu.recipe.title}</div>)}
            </div>)}

            {isSmallView && (<div>
                <a href='#' onClick={() => setIsOpened(true)}><FontAwesomeIcon icon={faPlus} />
                    {Localisation.ADD}
                </a>
            </div>)}

            <AddMenyOverlay isOpened={isOpened}
                date={props.date}
                recipes={props.recipes}
                onSubmit={(selectedRecipe: Recipe) => {
                    setIsOpened(false);
                    props.addMenu({
                        date: props.date.getTime(),
                        recipe: selectedRecipe
                    });
                }}
                onCancel={() => setIsOpened(false)} />
        </div>
    </div>);
}

export default connect(mapStateToProps, { addMenu })(Day);