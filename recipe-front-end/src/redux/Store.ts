import { Category, QuantityLessIngredient, Recipe } from '../interfaces/Recipe';
import { removeFromArray, updateDayMenuWithDate } from '../utils/ArrayUtils';
import { addDays, calculateStartOfDate } from '../utils/DateUtils';
import { replaceRecipe, toggleIngredientsBoughtForMenus } from './ReducerHelpers';

export interface UserData {
    loggedIn: boolean;
    name: string | undefined;
}

export enum OpenedMenu {
    NONE,
    SESSION
}

export interface DayMenu {
    date: number;
    menuId: number;
    recipe: Recipe;
    ingredientsBought: boolean;
}

export interface DateRange {
    start: Date;
    end: Date;
}

export interface ReduxModel {
    recipes: Recipe[];
    openedMenu: OpenedMenu;
    user: UserData;
    menuPlanning: DayMenu[];
    activeDay: number | undefined;
    mobileFabOpened: boolean;
    shoppingDateRange: DateRange;
    categories: Category[];
    ingredients: QuantityLessIngredient[];
}

export enum Actions {
    TOGGLE_MENU = 'SWITCH_MENU',
    LOG_OUT = 'LOG_OUT',
    ADD_RECIPE = 'ADD_RECIPE',
    EDIT_RECIPE = 'EDIT_RECIPE',
    REMOVE_RECIPE = 'REMOVE_RECIPE',
    ADD_MENU = 'ADD_MENU',
    REMOVE_MENU = 'REMOVE_MENU',
    UPDATE_ACTIVE_DAY = 'UPDATE_ACTIVE_DAY',
    UPDATE_MENU_DAY = 'UPDATE_MENU_DAY',
    MOBILE_FAB_OPENED = 'MOBILE_FAB_OPENED',
    UPDATE_SHOPPING_RANGE = 'UPDATE_SHOPPING_RANGE',
    TOGGLE_MENU_INGREDIENTS_BOUGHT = 'TOGGLE_MENU_INGREDIENTS_BOUGHT'
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

export interface EditRecipeAction {
    type: Actions.EDIT_RECIPE;
    recipe: Recipe;
}

export interface RemoveRecipeAction {
    type: Actions.REMOVE_RECIPE;
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

export interface UpdateShoppingRangeAction {
    type: Actions.UPDATE_SHOPPING_RANGE;
    range: DateRange;
}

export interface ToggleMenuIngredientsBoughtAction {
    type: Actions.TOGGLE_MENU_INGREDIENTS_BOUGHT;
    menus: DayMenu[];
    bought: boolean;
}

const today = calculateStartOfDate(new Date());
const nextWeek = addDays(today, 7);

export const defaultState: ReduxModel = {
    recipes: [],
    openedMenu: OpenedMenu.NONE,
    menuPlanning: [],
    user: {
        loggedIn: false,
        name: undefined
    },
    activeDay: undefined,
    mobileFabOpened: false,
    shoppingDateRange: {
        start: today,
        end: nextWeek
    },
    categories: [],
    ingredients: []
}

export type ReduxAction = ToggleMenuAction | 
    LogoutAction | 
    AddRecipeAction | 
    EditRecipeAction |
    RemoveRecipeAction |
    AddMenuAction | 
    RemoveMenuAction | 
    UpdateActiveDayAction | 
    UpdateMenuDayAction |
    UpdateMobileFapOpenedAction |
    UpdateShoppingRangeAction |
    ToggleMenuIngredientsBoughtAction;

export function handleState(oldState: ReduxModel = defaultState, action: ReduxAction): ReduxModel {
    switch (action.type) {
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
        case Actions.UPDATE_SHOPPING_RANGE:
            return {
                ...oldState,
                shoppingDateRange: action.range
            };
        case Actions.TOGGLE_MENU_INGREDIENTS_BOUGHT:
            return {
                ...oldState,
                menuPlanning: toggleIngredientsBoughtForMenus(oldState.menuPlanning, action.menus, action.bought)
            };
        case Actions.REMOVE_RECIPE:
            return {
                ...oldState,
                recipes: removeFromArray(action.recipe, oldState.recipes)
            };
        case Actions.EDIT_RECIPE:
            return {
                ...oldState,
                recipes: replaceRecipe(oldState.recipes, action.recipe)
            };
        default:
            // not supported yet
    }

    return oldState;
}