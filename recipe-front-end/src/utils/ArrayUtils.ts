import { DayMenu } from "../redux/Store";

export function removeFromArray<T>(item: T, fromArray: T[]): T[] {
    const index = fromArray.indexOf(item);
    fromArray.splice(index, 1)
    return fromArray;
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

export function flatArray<T>(array: T[][]): T[] {
    return Array.prototype.concat.apply([], array);
}

export type LinkedMap<T> = { [key: string]: T };
export function convertArrayToLinkedMap<T>(items: T[], queryKey: keyof T): LinkedMap<T> {
    return items.reduce((previous: LinkedMap<T>, next: T) => {
        const key = next[queryKey];
        previous[key as any] = next;
        return previous;
      }, {});
}