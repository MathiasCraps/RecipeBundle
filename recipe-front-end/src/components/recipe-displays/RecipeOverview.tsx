import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Heading, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect, useRouteMatch } from 'react-router-dom';
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { ReduxModel } from "../../redux/Store";
import ContentContainer from "../common/ContentContainer";
import RangePicker from '../range-picker/RangePicker';

interface ReduxProps {
    recipes: Recipe[];
}

type Props = ReduxProps;

enum Direction {
    PREVIOUS,
    NEXT
}

function getSurroundingRecipeId(currentIndex: number, recipes: Recipe[], direction: Direction) {
    const indexInArray = recipes.indexOf(recipes.filter((recipe) => recipe.id === currentIndex)[0]);

    const proposedRecipeId = indexInArray + (direction === Direction.PREVIOUS ? -1 : +1);
    return recipes[Math.min(recipes.length - 1, Math.max(0, proposedRecipeId))].id;
}

function mapStateToProps(state: ReduxModel): ReduxProps {
    return {
        recipes: state.recipes
    };
}

function RecipeOverview(props: Props) {
    const [originalTouch, setOriginalTouch] = useState(0);
    const [pickerVisible, setPickerIsVisible] = useState(false);
    const [direction, setDirection] = useState<Direction>();
    const urlId = useRouteMatch<{ id: string | undefined }>(`${Paths.RECIPE_OVERVIEW}/:id`);
    const recipe = props.recipes.filter((recipe) => recipe.id === Number(urlId?.params.id))[0];
    const previous = getSurroundingRecipeId(recipe.id, props.recipes, Direction.PREVIOUS);
    const next = getSurroundingRecipeId(recipe.id, props.recipes, Direction.NEXT);

    if (!recipe) {
        return <Redirect to={Paths.BASE} />
    }

    useEffect(() => {
        function handleKeyPress(keyEvent: KeyboardEvent) {
            switch (keyEvent.code) {
                case 'Escape':
                    window.location.href = Paths.BASE;
                    return;
                case "ArrowLeft":
                    window.location.href = `${Paths.RECIPE_OVERVIEW}/${previous}`
                    return;
                case "ArrowRight":
                    window.location.href = `${Paths.RECIPE_OVERVIEW}/${next}`
                    return;
                default:
                // ignore
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
                window.location.href = `${Paths.RECIPE_OVERVIEW}/${previous}`
            }
        }}
        onTouchEndCapture={() => {
            if (direction !== undefined) {
                window.location.href = `${Paths.RECIPE_OVERVIEW}/${direction === Direction.PREVIOUS ? previous : next}`;
            }

            setOriginalTouch(0);
            setDirection(undefined);
        }}
    ><ContentContainer>
            <Link className={`recipe-overview-previous ${direction === Direction.PREVIOUS ? 'showTap' : ''}`} to={`${Paths.RECIPE_OVERVIEW}/${previous}`} >
                <ArrowBackIcon boxSize="2em" aria-label={Localisation.PREVIOUS_RECIPE} />
            </Link>
            <Link className={`recipe-overview-next ${direction === Direction.NEXT ? 'showTap' : ''}`} to={`${Paths.RECIPE_OVERVIEW}/${next}`} >
                <ArrowForwardIcon boxSize="2em" aria-label={Localisation.NEXT_RECIPE} />
            </Link>
            <Heading as="h2">{recipe.title}</Heading>
            <Image src={recipe.image} alt="" />
            <div>
                <a href="#" onClick={() => setPickerIsVisible(!pickerVisible)}>{Localisation.PLAN_IN}</a>
                <div>
                    <RangePicker showNextMonth={false} isVisible={pickerVisible} onClosing={() => setPickerIsVisible(false)} />
                </div>
            </div>
            <Heading as="h3">{Localisation.INGREDIENTS}</Heading>
            <ul>{recipe.ingredients.map((ingredient, index) => (
                <li key={index}><strong>{ingredient.name}</strong>, {ingredient.quantity_number ? ingredient.quantity_number.toLocaleString() : ''} {ingredient.quantity_description}
                </li>))}</ul>
            <Heading as="h3">{Localisation.STEPS}</Heading>
            {recipe.steps.split('\\n').map((step, index) => <p key={index}>{step}</p>)}
        </ContentContainer></div>);
}

export default connect(mapStateToProps)(RecipeOverview);