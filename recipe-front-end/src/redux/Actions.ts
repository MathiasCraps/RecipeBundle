import { Dispatch } from "redux";
import { AddMenuResponse } from "../interfaces/AddMenuResponse";
import { AddRecipeResponse } from "../interfaces/AddRecipeResponse";
import { Recipe } from "../interfaces/Recipe";
import { UpdateMenuResponse } from "../interfaces/UpdateMenuResponse";
import fetchGraphQL from '../utils/FetchGraphQL';
import { waitForDataAsJson } from "../utils/FetchUtils";
import { Actions, AddMenuAction, AddRecipeAction, DateRange, DayMenu, LogoutAction, OpenedMenu, RemoveMenuAction, ToggleMenuAction, ToggleMenuIngredientsBoughtAction, UpdateActiveDayAction, UpdateMenuDayAction, UpdateMobileFapOpenedAction, UpdateShoppingRangeAction } from "./Store";

export function switchMenu(menu: OpenedMenu): ToggleMenuAction {
    return {
        type: Actions.TOGGLE_MENU,
        menu
    }
}

export function doLogOut(dispatch: Dispatch<LogoutAction>): () => Promise<void> {
    return async function (): Promise<void> {
        try {
            await fetch('/logout');
            dispatch({ type: Actions.LOG_OUT });
        } catch (err) {
            console.log('logout failed', err);
        }
    }
}

export type AddRecipeReturn = (recipe: Recipe, formData: FormData) => Promise<void>;
export function addRecipe(dispatch: Dispatch<AddRecipeAction>,): AddRecipeReturn {
    return async function (recipe: Recipe, formData: FormData): Promise<void> {
        const response = await waitForDataAsJson<AddRecipeResponse>('/addRecipe', {
            method: 'POST',
            body: formData
        });

        if (response.error) {
            throw new Error(response.error);
        }

        try {
            const id = response.recipeId;
            if (typeof id !== 'number') {
                throw new Error('No id');
            }

            recipe.id = id;
            dispatch({
                type: Actions.ADD_RECIPE,
                recipe: recipe
            })
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export function addMenu(dispatch: Dispatch<AddMenuAction>): (menu: DayMenu) => Promise<void> {
    return async function (menu: DayMenu): Promise<void> {
        try {
            const data = (await fetchGraphQL<{addMenu: AddMenuResponse}>(`mutation { 
                addMenu(date: ${menu.date}, recipeId: ${menu.recipe.id}) {
                    success
                    menuId
                    error
                }
            }`)).addMenu;

            if (data.error || typeof data.menuId !== 'number') {
                throw new Error('failed to post');
            }

            menu.menuId = data.menuId;

            dispatch({
                type: Actions.ADD_MENU,
                menu
            });
        } catch (err) {
            console.log('adding menu failed', err);
        }
    };
}

export function removeMenu(dispatch: Dispatch<RemoveMenuAction>): (menu: DayMenu) => Promise<void> {
    return async function (menu: DayMenu): Promise<void> {
        try {
            await fetchGraphQL(`mutation { 
                removeMenu(menuId: ${menu.menuId}) {
                    success
                    error
                }
            }`);

            dispatch({
                type: Actions.REMOVE_MENU,
                menu
            })
        } catch (err) {
            console.log('removing menu failed', err);
        }
    }
}

export function updateActiveDay(day: number | undefined): UpdateActiveDayAction {
    return {
        type: Actions.UPDATE_ACTIVE_DAY,
        day
    }
}

export type UpdateMenuDayReturn = (menuId: number, toDay: number) => Promise<void>;
export function updatePlannedMenuDay(dispatch: Dispatch<UpdateMenuDayAction>): UpdateMenuDayReturn {
    return async function (menuId: number, toDay: number) {
        try {
            const response = (await fetchGraphQL<{updateMenu: UpdateMenuResponse}>(`mutation { 
                updateMenu(date: ${toDay}, menuId: ${menuId}) {
                    success
                    error
                }
            }`)).updateMenu;

            if (response.error) {
                throw new Error('Update failed');
            }
    
            dispatch({
                type: Actions.UPDATE_MENU_DAY,
                menuId,
                toDay
            });
        } catch (err) {
            console.log(err);
        }
    }
}

export function updateMobileFapOpened(isOpened: boolean): UpdateMobileFapOpenedAction {
    return {
        type: Actions.MOBILE_FAB_OPENED,
        isOpened
    }
}

export const LOCAL_STORAGE_RANGE_NAME = 'shopping-range';
export function updateShoppingRange(range: DateRange): UpdateShoppingRangeAction {
    localStorage.setItem(LOCAL_STORAGE_RANGE_NAME, JSON.stringify({
        start: Number(range.start),
        end: Number(range.end)
    }));

    return {
        type: Actions.UPDATE_SHOPPING_RANGE,
        range
    }
}

export type toggleMenuIngredientsBoughtReturn = (menu: DayMenu[], bought: boolean) => Promise<void>;
export function toggleMenuIngredientsBought(dispatch: Dispatch<ToggleMenuIngredientsBoughtAction>): toggleMenuIngredientsBoughtReturn {
    return async function (menus: DayMenu[], bought: boolean) {
        const menuIds = menus.map((menu) => menu.menuId).join(',');
        await fetchGraphQL<{updateMenu: {success: boolean}}>(`mutation { 
            updateMenuIngredientsBought(menuIds: [${menuIds}], isBought: ${bought}) {
                success
            }
        }`);

        dispatch({
            type: Actions.TOGGLE_MENU_INGREDIENTS_BOUGHT,
            menus,
            bought
        });
    }
}