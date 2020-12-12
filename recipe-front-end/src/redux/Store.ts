import { createStore } from 'redux';

export interface ReduxModel {
    view: ViewType;
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
}

const defaultState: ReduxModel = {
    view: ViewType.Overview
}

function handleState(oldState: ReduxModel = defaultState, action: ChangeViewAction) {
    switch (action.type) {
        case Actions.CHANGE_VIEW:
            if (oldState.view !== action.view) {
                return {
                    ...oldState, view: action.view
                }
            }
    }

    return oldState;
}


export const store = createStore(handleState);