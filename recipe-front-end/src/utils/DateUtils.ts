export const FULL_DAY_IN_MS  = 24 * 60 * 60 * 1e3;

export function calculateStartOfDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function normalizeWeekDay(day: number): number {    
    if (day === 0) {
        return 6;
    }
    return day - 1;
}
