import { Recipe } from '../interfaces/Recipe';
import { Direction } from './Actions';

export interface ReduxModel {
    view: ViewType;
    recipes: Recipe[];
    activeRecipe: Recipe | undefined;
    loginMenuOpened: boolean;
    loggedIn: boolean; // todo: replace in future with user data object. Specifics still t.b.d.
    userName: string | undefined;
}

export enum ViewType {
    Overview,
    RecipeView
}

export enum Actions {
    CHANGE_VIEW = 'CHANGE_VIEW',
    SWITCH_ACTIVE_RECIPE = 'SWITCH_ACTIVE_RECIPE',
    TOGGLE_LOGIN_MENU = 'TOGGLE_LOGIN_MENU',
    LOG_OUT = 'LOG_OUT'
}

export interface ChangeViewAction {
    type: Actions.CHANGE_VIEW;
    view: ViewType
    recipe: Recipe | undefined
}

export interface SwitchActiveRecipeAction {
    type: Actions.SWITCH_ACTIVE_RECIPE;
    direction: Direction;
}

export interface ToggleLoginFormAction {
    type: Actions.TOGGLE_LOGIN_MENU;
}

export interface LogoutAction {
    type: Actions.LOG_OUT;
}

export const defaultState: ReduxModel = {
    view: ViewType.Overview,
    recipes: [],
    activeRecipe: undefined,
    loginMenuOpened: false,
    loggedIn: false,
    userName: undefined
}

type ReduxAction = ChangeViewAction | SwitchActiveRecipeAction | ToggleLoginFormAction | LogoutAction;

export function handleState(oldState: ReduxModel = defaultState, action: ReduxAction): ReduxModel {
    switch (action.type) {
        case Actions.CHANGE_VIEW:
            if (oldState.view !== action.view) {
                return {
                    ...oldState, view: action.view, activeRecipe: action.recipe
                }
            }
            break;
        case Actions.SWITCH_ACTIVE_RECIPE:
            if (oldState.activeRecipe) {
                const recipeIndex = oldState.recipes.indexOf(oldState.activeRecipe);
                const adjustedRecipe = recipeIndex + (action.direction === Direction.PREVIOUS ? -1 : +1);
                const boundariesClamped = Math.min(oldState.recipes.length - 1, Math.max(0, adjustedRecipe))    
                return {
                    ...oldState,
                    activeRecipe: oldState.recipes[boundariesClamped]
                }    
            }
            break;
        case Actions.TOGGLE_LOGIN_MENU:
            return {
                ...oldState,
                loginMenuOpened: !oldState.loginMenuOpened
            }
        case Actions.LOG_OUT:
            return {
                ...oldState,
                loggedIn: false,
                userName: undefined
            }
        default:
            // not supported yet
    }

    return oldState;
}