import { Actions, ViewType, ChangeViewAction } from "./Store";

export function changeActiveView(view: ViewType): ChangeViewAction {
    return {
        type: Actions.CHANGE_VIEW,
        view
    };
}