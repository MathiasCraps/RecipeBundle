import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Heading, Image, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, useToast } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect, useRouteMatch } from 'react-router-dom';
import { Dispatch } from 'redux';
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { addMenu } from '../../redux/Actions';
import { AddMenuAction, DayMenu, ReduxModel } from "../../redux/Store";
import ContentContainer from "../common/ContentContainer";
import SingleDayPicker from '../range-picker/SingleDayPicker';

interface ReduxProps {
    recipes: Recipe[];
    loggedIn: boolean;
}

interface ReduxActions {
    addMenu: (menu: DayMenu) => Promise<void>;
}

type Props = ReduxProps & ReduxActions;

enum Direction {
    PREVIOUS,
    NEXT
}

function getSurroundingRecipeId(currentIndex: number, recipes: Recipe[], direction: Direction) {
    const indexInArray = recipes.indexOf(recipes.filter((recipe) => recipe.id === currentIndex)[0]);

    const proposedRecipeId = indexInArray + (direction === Direction.PREVIOUS ? -1 : +1);
    return recipes[Math.min(recipes.length - 1, Math.max(0, proposedRecipeId))].id;
}

function map(dispatch: Dispatch<AddMenuAction>) {
    return {
        addMenu: addMenu(dispatch),
    };
}

function mapStateToProps(state: ReduxModel): ReduxProps {
    return {
        recipes: state.recipes,
        loggedIn: state.user.loggedIn
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
    const toast = useToast();
    const initialFocusRef = useRef<HTMLDivElement>(null);

    if (!recipe) {
        return <Redirect to={Paths.BASE} />
    }

    useEffect(() => {
        function handleKeyPress(keyEvent: KeyboardEvent) {
            if (pickerVisible) {
                return false;
            }

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

            {props.loggedIn && <Popover
                placement="bottom"
                closeOnBlur={true}
                isOpen={pickerVisible}
                initialFocusRef={initialFocusRef}
                onClose={() => setPickerIsVisible(!pickerVisible)}
            >
                <PopoverTrigger>
                    <button
                        className="date-range-initiator"
                        onClick={() => setPickerIsVisible(!pickerVisible)}>
                        {Localisation.PLAN_IN}
                    </button></PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader paddingTop="0.5em" fontWeight="bold" border="0">
                        {Localisation.PLAN_IN}
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <SingleDayPicker
                            isVisible={pickerVisible}
                            onClose={() => setPickerIsVisible(false)}
                            initialFocusRef={initialFocusRef}
                            onComplete={async (date: Date) => {
                                setPickerIsVisible(false);
                                await props.addMenu({
                                    date: Number(date),
                                    menuId: -1,
                                    recipe: recipe
                                });
                                toast({
                                    description: Localisation.ADDING_MENU_WAS_SUCCESS,
                                    status: 'success',
                                    isClosable: true,
                                });
                            }} />
                    </PopoverBody>
                </PopoverContent>
            </Popover>}

            <div className="clearer"></div>
            <Heading as="h3">{Localisation.INGREDIENTS}</Heading>
            <ul>{recipe.ingredients.map((ingredient, index) => (
                <li key={index}><strong>{ingredient.name}</strong>, {ingredient.quantity_number ? ingredient.quantity_number.toLocaleString() : ''} {ingredient.quantity_description}
                </li>))}</ul>
            <Heading as="h3">{Localisation.STEPS}</Heading>
            {recipe.steps.split('\\n').map((step, index) => <p key={index}>{step}</p>)}
        </ContentContainer></div >);
}

export default connect(mapStateToProps, map)(RecipeOverview);