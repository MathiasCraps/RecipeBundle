export type LinkedMap<T> = { [key: string]: T };
export function convertArrayToLinkedMapWithPredicate<T>(items: T[], predicate: (item: T) => string): LinkedMap<T> {
    return items.reduce((previous: LinkedMap<T>, next: T) => {
        previous[predicate(next)] = next;
        return previous;
      }, {});
}