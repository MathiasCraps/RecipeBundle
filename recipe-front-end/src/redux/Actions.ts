import { Dispatch } from "redux";
import { AddMenuResponse } from "../interfaces/AddMenuResponse";
import { AddRecipeResponse } from "../interfaces/AddRecipeResponse";
import { RawIngredient, Recipe } from "../interfaces/Recipe";
import { RemoveRecipeResponse } from '../interfaces/RemoveRecipeResponse';
import { UpdateMenuResponse } from "../interfaces/UpdateMenuResponse";
import fetchGraphQL from '../utils/FetchGraphQL';
import { waitForDataAsJson } from "../utils/FetchUtils";
import { Actions, AddIngredientAction, AddMenuAction, AddRecipeAction, DateRange, DayMenu, EditRecipeAction, InventoryItem, LogoutAction, OpenedMenu, RemoveMenuAction, RemoveRecipeAction, ToggleMenuAction, ToggleMenuIngredientsBoughtAction, UpdateActiveDayAction, UpdateInventoryAction, UpdateInventoryModification, UpdateInventoryQuantitiesToDesiredAction, UpdateMenuDayAction, UpdateMobileFapOpenedAction, UpdateShoppingRangeAction } from "./Store";

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

        if (response.image) {
            recipe.image = response.image;
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

export type EditRecipeReturn = (recipe: Recipe, formData: FormData) => Promise<void>;
export function editRecipe(dispatch: Dispatch<EditRecipeAction>): EditRecipeReturn {
    return async function (recipe: Recipe, formData: FormData): Promise<void> {
        const response = await waitForDataAsJson<AddRecipeResponse>('/editRecipe', {
            method: 'POST',
            body: formData
        });

        if (response.error) {
            throw new Error(response.error);
        }

        if (response.image) {
            recipe.image = response.image;
        }

        try {
            dispatch({
                type: Actions.EDIT_RECIPE,
                recipe: recipe
            })
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export type RemoveRecipeReturn = (recipe: Recipe) => Promise<boolean>;
export function removeRecipe(dispatch: Dispatch<RemoveRecipeAction>,): RemoveRecipeReturn {
    return async function (recipe: Recipe): Promise<boolean> {
        try {
            const data = (await fetchGraphQL<{ removeRecipe: RemoveRecipeResponse }>(`mutation { 
                removeRecipe(recipeId: ${recipe.id}) {
                    success
                }
            }`)).removeRecipe;
    
    
            if (data.success) {
                dispatch({
                    type: Actions.REMOVE_RECIPE,
                    recipe: recipe
                });
            }
            
            return data.success;
        } catch (err) {
            return false;
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
    if (Number(range.end) > Number(new Date())) {
        localStorage.setItem(LOCAL_STORAGE_RANGE_NAME, JSON.stringify({
            start: Number(range.start),
            end: Number(range.end)
        }));    
    }

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

export type updateInventoryActionReturn = (item: InventoryItem,  action: UpdateInventoryModification) => Promise<boolean>;
export function updateInventoryAction(dispatch: Dispatch<UpdateInventoryAction>): updateInventoryActionReturn {
    return async function (item: InventoryItem, action: UpdateInventoryModification) {
        try {
            const success = (await fetchGraphQL<{updateInventory: {success: boolean}}>(`mutation { 
                updateInventory(type: "${action}", ingredientId: ${item.ingredient.id}, quantity: ${item.quantity}, desiredQuantity: ${item.desiredQuantity}) {
                    success
                }
            }`)).updateInventory.success;
    
            if (!success) {
                throw new Error('failed');
            }
    
            dispatch({
                type: Actions.UPDATE_INVENTORY,
                action,
                item
            });

            return success;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

export type updateInventoryAsPurchasedReturn = () => Promise<void>;
export function updateInventoryAsPurchased(dispatch: Dispatch<UpdateInventoryQuantitiesToDesiredAction>): updateInventoryAsPurchasedReturn {
    return async function () {
        try {
            const { success } = (await fetchGraphQL<{updateInventoryAsPurchased: {success: boolean}}>(`mutation { 
                updateInventoryAsPurchased {
                    success
                }
            }`)).updateInventoryAsPurchased;
    
            if (!success) {
                throw new Error('Failed to update');
            }

            dispatch({
                type: Actions.UPDATE_INVENTORY_QUANTITIES_TO_DESIRED,
            });
        } catch (err) {
            console.log('failed', err);
        }
    }
}

export type addIngredientReturn = (ingredient: RawIngredient) => Promise<number>;
export function addIngredientAction(dispatch: Dispatch<AddIngredientAction>): addIngredientReturn {
    return async function (ingredient: RawIngredient): Promise<number> {
        try {
            const { ingredientId, success } = (await fetchGraphQL<{addIngredient: {success: boolean, ingredientId: number}}>(`mutation { 
                addIngredient(name: "${ingredient.name}", categoryId: ${ingredient.categoryId}, quantity_description_id: ${ingredient.quantity_description_id}) {
                    success
                    ingredientId
                }
            }`)).addIngredient;

    
            if (!success) {
                throw new Error('failed');
            }

            const updatedIngredient: RawIngredient = {
                ...ingredient,
                id: ingredientId
            }


            dispatch({
                type: Actions.ADD_INGREDIENT,
                ingredient: updatedIngredient
            });

            return ingredientId;
        } catch (err) {
            throw new Error('failed');
        }
    }
}