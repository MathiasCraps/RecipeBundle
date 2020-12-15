import { Recipe } from '../interfaces/Recipe';
import { Direction } from './Actions';

export interface ReduxModel {
    view: ViewType;
    recipes: Recipe[];
    activeRecipe: Recipe | undefined;
}

export enum ViewType {
    Overview,
    RecipeView
}

export enum Actions {
    CHANGE_VIEW = 'CHANGE_VIEW',
    SWITCH_ACTIVE_RECIPE = 'SWITCH_ACTIVE_RECIPE'
};

export interface ChangeViewAction {
    type: Actions.CHANGE_VIEW;
    view: ViewType
    recipe: Recipe | undefined
}

export interface SwitchActiveRecipeAction {
    type: Actions.SWITCH_ACTIVE_RECIPE;
    direction: Direction;
}

const defaultState: ReduxModel = {
    view: ViewType.Overview,
    recipes: [],
    activeRecipe: undefined
}

export function handleState(oldState: ReduxModel = defaultState, action: ChangeViewAction | SwitchActiveRecipeAction): ReduxModel {
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
    }

    return oldState;
}