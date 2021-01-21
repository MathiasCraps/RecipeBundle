import { Dispatch } from "redux";
import { Recipe } from "../interfaces/Recipe";
import { Actions, AddMenuAction, ChangeViewAction, DayMenu, LogoutAction, OpenedMenu, RemoveMenuAction, SwitchActiveRecipeAction, ToggleMenuAction, UpdateRecipesAction, ViewType } from "./Store";

export function changeActiveView(view: ViewType, recipe: Recipe | undefined): ChangeViewAction {
    return {
        type: Actions.CHANGE_VIEW,
        view,
        recipe
    };
}

export enum Direction {
    PREVIOUS,
    NEXT
}

export function switchActiveRecipe(direction: Direction): SwitchActiveRecipeAction {
    return {
        type: Actions.SWITCH_ACTIVE_RECIPE,
        direction
    }
}

export function switchMenu(menu: OpenedMenu): ToggleMenuAction {
    return {
        type: Actions.TOGGLE_MENU,
        menu
    }
}

export function doLogOut(dispatch: Dispatch<LogoutAction>): () => Promise<void> {
    return async function(): Promise<void> {
        try {
            await fetch('/logout');
            dispatch({ type: Actions.LOG_OUT });
        } catch (err) {
            console.log('logout failed', err);
        }
    }    
}

export function updateRecipes(recipes: Recipe[]): UpdateRecipesAction {
    return {
        type: Actions.UPDATE_RECIPES,
        recipes
    }
}

export function addMenu(dispatch: Dispatch<AddMenuAction>): (menu: DayMenu) => Promise<void> {
    return async function(menu: DayMenu): Promise<void> {
        try {
            await fetch('/addMenu', {
                method: 'POST',
                body: JSON.stringify(menu),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            dispatch({
                type: Actions.ADD_MENU,
                menu
            })
        } catch (err) {
            console.log('adding menu failed', err);
        }
    }
}

export function removeMenu(dispatch: Dispatch<RemoveMenuAction>): (menu: DayMenu) => Promise<void> {
    return async function(menu: DayMenu): Promise<void> {
        try {
            await fetch('/removeMenu', {
                method: 'POST',
                body: JSON.stringify(menu),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            dispatch({
                type: Actions.REMOVE_MENU,
                menu
            })
        } catch(err) {
            console.log('removing menu failed', err);
        }
    }
}
