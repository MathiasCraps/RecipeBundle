import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Heading, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect, useRouteMatch } from 'react-router-dom';
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { Direction, switchActiveRecipe } from "../../redux/Actions";
import { ReduxModel } from "../../redux/Store";
import ContentContainer from "../common/ContentContainer";

interface RecipeOverviewProps {
    recipes: Recipe[];
}

interface ReduxProps {
    switchActiveRecipe: typeof switchActiveRecipe;
}

type Props = RecipeOverviewProps & ReduxProps;

function mapStateToProps(state: ReduxModel) {
    return {
        recipes: state.recipes
    };
}

interface RecipeOverviewUrlParams {
    id: string | undefined;
}

function RecipeOverview(props: Props) {
    const [originalTouch, setOriginalTouch] = useState(0);
    const [direction, setDirection] = useState<Direction>();
    const urlId = useRouteMatch<RecipeOverviewUrlParams>(`${Paths.RECIPE_OVERVIEW}/:id`);
    const recipe = props.recipes.filter((recipe) => recipe.id === Number(urlId?.params.id))[0];

    if (!recipe) {
        return <Redirect to={Paths.BASE} />
    }
    
    useEffect(() => {
        function handleKeyPress(keyEvent: KeyboardEvent) {
            let direction: Direction | undefined;

            if (keyEvent.code === 'Escape') {
                window.location.href = Paths.BASE;
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

            const xDifference = originalTouch - e.touches[0].clientX;
            const minimumMoveFactor = 50;

            if (xDifference > minimumMoveFactor) {
                setDirection(Direction.NEXT);
            } else if (xDifference < -minimumMoveFactor) {
                setDirection(Direction.PREVIOUS);
            }
        }}
        onTouchEndCapture={() => {
            if (direction !== undefined) {
                props.switchActiveRecipe(direction);
            }

            setOriginalTouch(0);
            setDirection(0);
            setDirection(undefined);
        }}
    ><ContentContainer>
            <a className={`recipe-overview-previous ${direction === Direction.PREVIOUS ? 'showTap' : ''}`} href="#" onClick={() => props.switchActiveRecipe(Direction.PREVIOUS)} >
                <ArrowBackIcon boxSize="2em" aria-label={Localisation.PREVIOUS_RECIPE} />
            </a>
            <a className={`recipe-overview-next ${direction === Direction.NEXT ? 'showTap' : ''}`} href="#" onClick={() => props.switchActiveRecipe(Direction.NEXT)}>
                <ArrowForwardIcon boxSize="2em" aria-label={Localisation.NEXT_RECIPE} />
            </a>
            <Heading as="h2">{recipe.title}</Heading>
            <Image src={recipe.image} alt="" />
            <Heading as="h3">{Localisation.INGREDIENTS}</Heading>
            <ul>{recipe.ingredients.map((ingredient, index) => (
                <li key={index}><strong>{ingredient.name}</strong>, {ingredient.quantity_number ? ingredient.quantity_number.toLocaleString() : ''} {ingredient.quantity_description}
                </li>))}</ul>
            <Heading as="h3">{Localisation.STEPS}</Heading>
            {recipe.steps.split('\\n').map((step, index) => <p key={index}>{step}</p>)}
        </ContentContainer></div>);
}

export default connect(mapStateToProps, { switchActiveRecipe })(RecipeOverview);