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

export function calculateMonthGrid(year: number, month: number): Date[][] {
    const amountOfDays = new Date(year, month+1, 0).getDate();
    const calendar: Date[][] = [];
    let week = -1;
    let startOfCurrentWeek = 1;

    for (let i = 1; i <= amountOfDays; i++) {
        const proposedDate = new Date(Date.UTC(year, month, i));
        const normalizedDay = normalizeWeekDay(proposedDate.getDay())
        if (startOfCurrentWeek === i || normalizedDay === 0) {
            calendar.push([]);
            week++;
            startOfCurrentWeek = proposedDate.getDate();
        }
        calendar[week].push(proposedDate);
    }
    return calendar;
}