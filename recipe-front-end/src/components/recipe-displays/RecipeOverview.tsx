import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Heading, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { changeActiveView, Direction, switchActiveRecipe } from "../../redux/Actions";
import { ReduxModel, ViewType } from "../../redux/Store";
import ContentContainer from "../common/ContentContainer";

interface RecipeOverviewProps {
    recipe: Recipe;
}

interface ReduxProps {
    changeActiveView: typeof changeActiveView;
    switchActiveRecipe: typeof switchActiveRecipe;
}

type Props = RecipeOverviewProps & ReduxProps;

function mapStateToProps(state: ReduxModel) {
    return {
        recipe: state.activeRecipe!
    };
}

function RecipeOverview(props: Props) {
    const [originalTouch, setOriginalTouch] = useState(0);
    const [moved, setMoved] = useState(0);

    useEffect(() => {
        function handleKeyPress(keyEvent: KeyboardEvent) {
            let direction: Direction | undefined;

            if (keyEvent.code === 'Escape') {
                props.changeActiveView(ViewType.Overview, undefined);
                return;
            }

            switch (keyEvent.code) {
                case "ArrowLeft":
                    direction = Direction.PREVIOUS;
                    break;
                case "ArrowRight":
                    direction = Direction.NEXT;
                    break;
                default:
                // ignore
            }
            if (direction !== undefined) {
                props.switchActiveRecipe(direction)
            }

        }

        document.body.addEventListener('keyup', handleKeyPress);
        return () => {
            document.body.removeEventListener('keyup', handleKeyPress);
        }
    });

    return (<div onTouchStartCapture={(e) => e.touches.length && setOriginalTouch(e.touches[0].clientX)}
        onTouchMoveCapture={(e) => {
            if (!e.touches.length) {
                return;
            }

            setMoved(e.touches[0].clientX);
        }}
        onTouchEndCapture={(e) => {
            const xDifference = originalTouch - moved;
            const minimumMoveFactor = 50;
            if (xDifference > minimumMoveFactor) {
                props.switchActiveRecipe(Direction.NEXT);
            } else if (xDifference < -minimumMoveFactor) {
                props.switchActiveRecipe(Direction.PREVIOUS);
            }

            setOriginalTouch(0);
            setMoved(0);
        }}
    ><ContentContainer>
            <a className="recipe-overview-previous" href="#" onClick={() => props.switchActiveRecipe(Direction.PREVIOUS)} >
                <ArrowBackIcon boxSize="2em" aria-label={Localisation.PREVIOUS_RECIPE} />
            </a>
            <a className="recipe-overview-next" href="#" onClick={() => props.switchActiveRecipe(Direction.NEXT)}>
                <ArrowForwardIcon boxSize="2em" aria-label={Localisation.NEXT_RECIPE} />
            </a>
            <Heading as="h2">{props.recipe.title}</Heading>
            <Image src={props.recipe.image} alt="" />
            <Heading as="h3">{Localisation.INGREDIENTS}</Heading>
            <ul>{props.recipe.ingredients.map((ingredient, index) => (
                <li key={index}><strong>{ingredient.name}</strong>, {ingredient.quantity_number ? ingredient.quantity_number.toLocaleString() : ''} {ingredient.quantity_description}
                </li>))}</ul>
            <Heading as="h3">{Localisation.STEPS}</Heading>
            {props.recipe.steps.split('\\n').map((step, index) => <p key={index}>{step}</p>)}
        </ContentContainer></div>);
}

export default connect(mapStateToProps, { changeActiveView, switchActiveRecipe })(RecipeOverview);