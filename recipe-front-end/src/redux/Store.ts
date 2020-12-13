import { createStore } from 'redux';
import { Recipe } from '../interfaces/Recipe';
import { testData } from './RecipeData';

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
    CHANGE_VIEW = 'CHANGE_VIEW'
};

export interface ChangeViewAction {
    type: Actions.CHANGE_VIEW;
    view: ViewType
    recipe: Recipe | undefined
}

const defaultState: ReduxModel = {
    view: ViewType.Overview,
    recipes: testData,
    activeRecipe: undefined
}

function handleState(oldState: ReduxModel = defaultState, action: ChangeViewAction) {
    switch (action.type) {
        case Actions.CHANGE_VIEW:
            if (oldState.view !== action.view) {
                return {
                    ...oldState, view: action.view, activeRecipe: action.recipe
                }
            }
    }

    return oldState;
}


export const store = createStore(handleState);