import { DayMenu } from "../redux/Store";

export function removeFromArray<T>(item: T, fromArray: T[]): T[] {
    const index = fromArray.indexOf(item);
    fromArray.splice(index, 1)
    return fromArray;
}

export function filterUndefined(value: any) {
    if (value === undefined) {
        return false;
    }

    return true;
}

export function updateDayMenuWithDate(dayMenu: DayMenu[], menuId: number, toDate: number): DayMenu[] {
    const shallowCopy = [...dayMenu];
    const entry = shallowCopy.find((dayMenu) => dayMenu.menuId === menuId);
    if (!entry) {
        return dayMenu; // do not mutate
    }

    const index = shallowCopy.indexOf(entry);
    const mutatedDayMenu = {...entry};
    mutatedDayMenu.date = toDate;
    shallowCopy[index] = mutatedDayMenu;

    return shallowCopy;
}