import { Recipe } from "../interfaces/Recipe";
import { Actions, ViewType, ChangeViewAction } from "./Store";

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

export function switchActiveRecipe(recipe: Recipe, direction: Direction) {
    return {
        type: Actions.SWITCH_ACTIVE_RECIPE,
        direction
    }
}