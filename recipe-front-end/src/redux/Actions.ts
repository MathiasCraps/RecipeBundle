import { Recipe } from "../interfaces/Recipe";
import { Actions, ViewType, ChangeViewAction, SwitchActiveRecipeAction, ToggleLoginFormAction } from "./Store";

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