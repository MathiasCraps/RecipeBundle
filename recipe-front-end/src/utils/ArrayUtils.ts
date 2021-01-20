export function removeFromArray<T>(item: T, fromArray: T[]): T[] {
    const index = fromArray.indexOf(item);
    fromArray.splice(index, 1)
    return fromArray;
}