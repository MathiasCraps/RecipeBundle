import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Heading, Image, useToast } from "@chakra-ui/react";
import { faCalendarWeek, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect, useRouteMatch } from 'react-router-dom';
import { Dispatch } from 'redux';
import { Recipe } from "../../interfaces/Recipe";
import { Localisation } from "../../localisation/AppTexts";
import { Paths } from '../../Paths';
import { addMenu, removeRecipe, RemoveRecipeReturn } from '../../redux/Actions';
import { AddMenuAction, DayMenu, ReduxModel, RemoveRecipeAction } from "../../redux/Store";
import { isSameUtcDay } from '../../utils/DateUtils';
import ContentContainer from "../common/ContentContainer";
import SimplePopover from '../common/SimplePopover';
import SingleDayPicker from '../range-picker/SingleDayPicker';
import './RecipeOverview.scss';

interface ReduxProps {
    recipes: Recipe[];
    loggedIn: boolean;
    menus: DayMenu[];
}

interface ReduxActions {
    addMenu: (menu: DayMenu) => Promise<void>;
    removeRecipe: RemoveRecipeReturn
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

function map(dispatch: Dispatch<AddMenuAction | RemoveRecipeAction>) {
    return {
        addMenu: addMenu(dispatch),
        removeRecipe: removeRecipe(dispatch)
    };
}

function mapStateToProps(state: ReduxModel): ReduxProps {
    return {
        recipes: state.recipes,
        loggedIn: state.user.loggedIn,
        menus: state.menuPlanning
    };
}

function RecipeOverview(props: Props) {
    const urlId = useRouteMatch<{ id: string | undefined }>(`${Paths.RECIPE_OVERVIEW}/:id`);
    const recipeId = urlId?.params.id || '-1';
    const recipe = props.recipes.filter((recipe) => recipe.id === Number(recipeId))[0];

    if (!recipe) {
        return <Redirect to={Paths.BASE} />
    }

    const plannedDates = props.menus
        .filter((menu) => menu.recipe.id === Number(recipeId))
        .map((item) => new Date(item.date));

    const [originalTouch, setOriginalTouch] = useState(0);
    const [pickerVisible, setPickerIsVisible] = useState(false);
    const [direction, setDirection] = useState<Direction>();
    const previous = getSurroundingRecipeId(recipe.id, props.recipes, Direction.PREVIOUS);
    const next = getSurroundingRecipeId(recipe.id, props.recipes, Direction.NEXT);
    const toast = useToast();
    const initialFocusRef = useRef<HTMLDivElement>(null);

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
    ><ContentContainer classes="recipe-overview">
            <Link className={`recipe-overview-previous ${direction === Direction.PREVIOUS ? 'showTap' : ''}`} to={`${Paths.RECIPE_OVERVIEW}/${previous}`} >
                <ArrowBackIcon boxSize="2em" aria-label={Localisation.PREVIOUS_RECIPE} />
            </Link>
            <Link className={`recipe-overview-next ${direction === Direction.NEXT ? 'showTap' : ''}`} to={`${Paths.RECIPE_OVERVIEW}/${next}`} >
                <ArrowForwardIcon boxSize="2em" aria-label={Localisation.NEXT_RECIPE} />
            </Link>
            <Image className="recipe-image" src={recipe.image} alt="" />
            <div className="content">
                <Heading as="h2">{recipe.title}</Heading>

                {props.loggedIn && <SimplePopover
                    trigger={<button
                        className="date-range-initiator"
                        onClick={() => setPickerIsVisible(!pickerVisible)}>
                        <FontAwesomeIcon icon={faCalendarWeek}/> {Localisation.PLAN_IN}
                    </button>}
                    onClose={() => setPickerIsVisible(false)}
                    isOpened={pickerVisible}
                    initialFocusRef={initialFocusRef}
                    title={Localisation.PLAN_IN}
                >
                    <SingleDayPicker
                        isVisible={pickerVisible}
                        onClose={() => setPickerIsVisible(false)}
                        initialFocusRef={initialFocusRef}
                        fillDayFilters={[(date: Date) => plannedDates.some(
                            plannedDate => isSameUtcDay(date, plannedDate)
                        )]}
                        onComplete={async (date: Date) => {
                            setPickerIsVisible(false);
                            await props.addMenu({
                                date: Number(date),
                                menuId: -1,
                                recipe: recipe,
                                ingredientsBought: false
                            });
                            toast({
                                description: Localisation.ADDING_MENU_WAS_SUCCESS,
                                status: 'success',
                                isClosable: true,
                            });
                        }} />
                </SimplePopover>}

                {props.loggedIn && <button
                    className="date-range-initiator"
                    onClick={async() => {
                        const success = await props.removeRecipe(recipe);
                        toast({
                            description: success ? Localisation.REMOVING_SUCCEEDED : Localisation.REMOVING_FAILED,
                            status: success ? 'success' : 'error',
                            isClosable: true
                        });
                        
                        if (success) {
                            window.location.href = Paths.BASE;
                        }
                    }}>
                    <FontAwesomeIcon icon={faTrash} /> {Localisation.REMOVE}
                </button>}

                {props.loggedIn && <Link to={`${Paths.EDIT_RECIPE}/${recipeId}`}><button className="date-range-initiator">
                    <FontAwesomeIcon icon={faPencilAlt} /> {Localisation.EDIT_RECIPE}
                </button></Link>}

                <div className="clearer"></div>
                <Heading as="h3">{Localisation.INGREDIENTS}</Heading>
                <ul>{recipe.ingredients.map((ingredient, index) => (
                    <li key={index}><strong>{ingredient.name}</strong>, {ingredient.quantity_number ? ingredient.quantity_number.toLocaleString() : ''} {ingredient.quantity_description}
                    </li>))}</ul>
                <Heading as="h3">{Localisation.STEPS}</Heading>
                {recipe.steps.split('\\n').map((step, index) => <p key={index}>{step}</p>)}
            </div>
        </ContentContainer></div >);
}

export default connect(mapStateToProps, map)(RecipeOverview);