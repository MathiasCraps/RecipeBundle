import { Recipe } from '../interfaces/Recipe';
import { removeFromArray } from '../utils/ArrayUtils';
import { Direction } from './Actions';

export interface UserData {
    loggedIn: boolean;
    name: string | undefined;
}

export enum OpenedMenu {
    NONE,
    SESSION,
    ADD_RECIPE
}

export interface DayMenu {
    date: number;
    recipeId: number;
}

export interface ReduxModel {
    view: ViewType;
    recipes: Recipe[];
    activeRecipe: Recipe | undefined;
    openedMenu: OpenedMenu;
    user: UserData;
    menuPlanning: DayMenu[]
}

export enum ViewType {
    Overview,
    RecipeView,
    AddRecipe,
    MenuPlanner
}

export enum Actions {
    CHANGE_VIEW = 'CHANGE_VIEW',
    SWITCH_ACTIVE_RECIPE = 'SWITCH_ACTIVE_RECIPE',
    TOGGLE_MENU = 'SWITCH_MENU',
    LOG_OUT = 'LOG_OUT',
    UPDATE_RECIPES = 'UPDATE_RECIPES',
    ADD_MENU = 'ADD_MENU',
    REMOVE_MENU = 'REMOVE_MENU'
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

export interface ToggleMenuAction {
    type: Actions.TOGGLE_MENU;
    menu: OpenedMenu;
}

export interface LogoutAction {
    type: Actions.LOG_OUT;
}

export interface UpdateRecipesAction {
    type: Actions.UPDATE_RECIPES;
    recipes: Recipe[];
}

export interface AddMenuAction {
    type: Actions.ADD_MENU;
    menu: DayMenu;
}

export interface RemoveMenuAction {
    type: Actions.REMOVE_MENU;
    menu: number;
}

export const defaultState: ReduxModel = {
    view: ViewType.Overview,
    recipes: [],
    activeRecipe: undefined,
    openedMenu: OpenedMenu.NONE,
    menuPlanning: [],
    user: {
        loggedIn: false,
        name: undefined
    }
}

type ReduxAction = ChangeViewAction | SwitchActiveRecipeAction | ToggleMenuAction | LogoutAction | UpdateRecipesAction | AddMenuAction | RemoveMenuAction;

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
        case Actions.TOGGLE_MENU:
            return {
                ...oldState,
                openedMenu: action.menu
            }
        case Actions.LOG_OUT:
            return {
                ...oldState,
                user: {
                    loggedIn: false,
                    name: undefined
                },
                openedMenu: OpenedMenu.NONE
            }
        case Actions.UPDATE_RECIPES:
            return {
                ...oldState,
                recipes: action.recipes
            }
        case Actions.ADD_MENU:
            return {
                ...oldState,
                menuPlanning: oldState.menuPlanning.concat([action.menu])
            }
        case Actions.REMOVE_MENU:
            return {
                ...oldState,
                menuPlanning: removeFromArray(action.menu, [...oldState.menuPlanning])
            }
        default:
            // not supported yet
    }

    return oldState;
}