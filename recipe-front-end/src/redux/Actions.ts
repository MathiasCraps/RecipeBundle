import { Dispatch } from "redux";
import { Recipe } from "../interfaces/Recipe";
import { Actions, ChangeViewAction, LogoutAction, SwitchActiveRecipeAction, ToggleLoginFormAction, ViewType } from "./Store";

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

export function toggleLoginForm(): ToggleLoginFormAction  {
    return {
        type: Actions.TOGGLE_LOGIN_MENU
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