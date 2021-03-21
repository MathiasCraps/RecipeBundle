import { DateRange } from '../redux/Store';

export const FULL_DAY_IN_MS = 24 * 60 * 60 * 1e3;

export function calculateStartOfDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function calculateStartOfMonthWithOffset(date: Date, offset: number) {
    return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export function normalizeWeekDay(day: number): number {
    if (day === 0) {
        return 6;
    }
    return day - 1;
}

export function calculateMonthGrid(year: number, month: number): Date[][] {
    const amountOfDays = new Date(year, month + 1, 0).getDate();
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

    return fillIncompleteWeeks(calendar);
}

function fillIncompleteWeeks(monthGrid: Date[][]): Date[][] {
    const firstWeek = monthGrid[0];
    if (firstWeek.length !== 7) {
        const input = [];
        for (let i = firstWeek.length; i < 7; i++) {
            input.push(new Date(NaN));
        }
        monthGrid[0] = input.concat([...monthGrid[0]]);
    }

    const lastWeek = [...monthGrid[monthGrid.length - 1]];
    if (lastWeek.length !== 7) {
        for (let i = lastWeek.length; i < 7; i++) {
            lastWeek.push(new Date(NaN))
        }

        monthGrid[monthGrid.length - 1] = lastWeek;
    }

    return monthGrid;
}

export function isSameUtcDay(day1: Date, day2: Date): boolean {
    return day1.getUTCFullYear() === day2.getUTCFullYear() &&
        day1.getUTCMonth() === day2.getUTCMonth() &&
        day1.getUTCDate() === day2.getUTCDate()
}

export function addDays(date: Date, days: number): Date {
    return new Date(Number(date) + (FULL_DAY_IN_MS * days));
}

export function dateIsInRange(dateToCompare: Date, fromDate: Date, toDate: Date): boolean {
    return calculateStartOfDate(fromDate) <= calculateStartOfDate(dateToCompare) &&
        calculateStartOfDate(toDate) >= calculateStartOfDate(dateToCompare);
}

export function parseDateRange(input: string | null): DateRange | undefined {
    if (!input) {
        return undefined;
    }

    try {
        const parsedInput: {start: number, end: number} = JSON.parse(input);
        return {
            start: new Date(parsedInput.start),
            end: new Date(parsedInput.end)
        }
    } catch (err) {
        return undefined;
    }
}