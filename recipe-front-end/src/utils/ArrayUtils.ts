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