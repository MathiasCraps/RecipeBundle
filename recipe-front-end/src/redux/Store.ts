import { Recipe } from '../interfaces/Recipe';
import { removeFromArray, updateDayMenuWithDate } from '../utils/ArrayUtils';
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
    menuId: number;
    recipe: Recipe;
}

export interface ReduxModel {
    view: ViewType;
    recipes: Recipe[];
    activeRecipe: Recipe | undefined;
    openedMenu: OpenedMenu;
    user: UserData;
    menuPlanning: DayMenu[];
    activeDay: number | undefined;
    mobileFabOpened: boolean;
}

export enum ViewType {
    Overview,
    RecipeView,
    AddRecipe,
    MenuPlanner,
    ShoppingList
}

export enum Actions {
    CHANGE_VIEW = 'CHANGE_VIEW',
    SWITCH_ACTIVE_RECIPE = 'SWITCH_ACTIVE_RECIPE',
    TOGGLE_MENU = 'SWITCH_MENU',
    LOG_OUT = 'LOG_OUT',
    ADD_RECIPE = 'ADD_RECIPE',
    ADD_MENU = 'ADD_MENU',
    REMOVE_MENU = 'REMOVE_MENU',
    UPDATE_ACTIVE_DAY = 'UPDATE_ACTIVE_DAY',
    UPDATE_MENU_DAY = 'UPDATE_MENU_DAY',
    MOBILE_FAB_OPENED = 'MOBILE_FAB_OPENED'
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

export interface AddRecipeAction {
    type: Actions.ADD_RECIPE;
    recipe: Recipe;
}

export interface AddMenuAction {
    type: Actions.ADD_MENU;
    menu: DayMenu;
}

export interface RemoveMenuAction {
    type: Actions.REMOVE_MENU;
    menu: DayMenu;
}

export interface UpdateActiveDayAction {
    type: Actions.UPDATE_ACTIVE_DAY;
    day: number | undefined;
}

export interface UpdateMenuDayAction {
    type: Actions.UPDATE_MENU_DAY;
    toDay: number;
    menuId: number;
}

export interface UpdateMobileFapOpenedAction {
    type: Actions.MOBILE_FAB_OPENED;
    isOpened: boolean;
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
    },
    activeDay: undefined,
    mobileFabOpened: false
}

export type ReduxAction = ChangeViewAction | 
    SwitchActiveRecipeAction | 
    ToggleMenuAction | 
    LogoutAction | 
    AddRecipeAction | 
    AddMenuAction | 
    RemoveMenuAction | 
    UpdateActiveDayAction | 
    UpdateMenuDayAction |
    UpdateMobileFapOpenedAction;

export function handleState(oldState: ReduxModel = defaultState, action: ReduxAction): ReduxModel {
    switch (action.type) {
        case Actions.CHANGE_VIEW:
            if (oldState.view !== action.view) {
                return {
                    ...oldState, view: action.view, activeRecipe: action.recipe, mobileFabOpened: false
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
                    activeRecipe: oldState.recipes[boundariesClamped],
                    mobileFabOpened: false
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
        case Actions.ADD_RECIPE:
            return {
                ...oldState,
                recipes: oldState.recipes.concat([action.recipe]) 
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
        case Actions.UPDATE_ACTIVE_DAY:
            return {
                ...oldState,
                activeDay: action.day
            }
        case Actions.UPDATE_MENU_DAY:
            return {
                ...oldState,
                menuPlanning: updateDayMenuWithDate(oldState.menuPlanning, action.menuId, action.toDay)
            }
        case Actions.MOBILE_FAB_OPENED:
            return {
                ...oldState,
                mobileFabOpened: action.isOpened
            }
        default:
            // not supported yet
    }

    return oldState;
}