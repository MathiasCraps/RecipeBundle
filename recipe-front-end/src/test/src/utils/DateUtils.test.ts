import { calculateStartOfDate, calculateStartOfMonthWithOffset, isSameUtcDay, normalizeWeekDay } from '../../../utils/DateUtils';

const referenceDate = new Date('Fri Feb 01 2021 00:00:00 GMT+0000')
const startDate = new Date('Fri Feb 01 2021 17:00:00 GMT+0000')

describe('DateUtils', () => {
    describe(`using date ${startDate}`, () => {
        describe('calling calculateStartOfDate', () => {
            let result: Date;

            beforeEach(() => {
                result = calculateStartOfDate(startDate);
            });

            test(`should normalize to ${referenceDate}`, () => {
                expect(Number(result)).toBe(Number(referenceDate));
            });
        });
    });

    describe('normalizeWeekDay', () => {
        [
            { input: 0, output: 6 },
            { input: 1, output: 0 },
            { input: 2, output: 1 },
            { input: 3, output: 2 },
            { input: 4, output: 3 },
            { input: 5, output: 4 },
            { input: 6, output: 5 }
        ].forEach((entry) => {
            describe(`when normalizing ${entry.input}`, () => {
                let result: number;
                beforeEach(() => {
                    result = normalizeWeekDay(entry.input);
                });

                test(`result is normalized to ${entry.output}`, () => {
                    expect(result).toBe(entry.output)
                });
            });
        });
    });

    describe('isSameUtcDay', () => {
        describe('when calling with exact same time', () => {
            let result: boolean;

            beforeEach(() => {
                result = isSameUtcDay(new Date(2021, 1, 1), new Date(2021, 1, 1));
            });

            test('returns true', () => {
                expect(result).toBe(true);
            });
        });

        describe('when called with different time, but same day', () => {
            let result: boolean;

            beforeEach(() => {
                result = isSameUtcDay(
                    new Date(Date.UTC(2021, 1, 1)),
                    new Date(Date.UTC(2021, 1, 1, 17, 0, 0))
                );
            });

            test('returns true', () => {
                expect(result).toBe(true);
            });

        });

        describe('when called with different day', () => {
            let result: boolean;

            beforeEach(() => {
                result = isSameUtcDay(new Date(2021, 1, 1), new Date(2021, 1, 15));
            });

            test('returns false', () => {
                expect(result).toBe(false);
            });
        });
    });

    describe('calculateStartOfMonthWithOffset', () => {
        const TEST_DATE = new Date(2021, 5, 1);

        [
            { input: TEST_DATE, offset: -1, expected: new Date(Date.UTC(2021, 4, 1)) },
            { input: TEST_DATE, offset: 0, expected: new Date(Date.UTC(2021, 5, 1)) },
            { input: TEST_DATE, offset: 1, expected: new Date(Date.UTC(2021, 6, 1)) },
            { input: new Date(2021, 1, 1), offset: -1, expected: new Date(Date.UTC(2020, 12, 1)) },
            { input: new Date(2020, 12, 1), offset: 1, expected: new Date(Date.UTC(2021, 1, 1)) }
        ].forEach((entry) => {
            describe(`called with ${entry.input} and ${entry.offset}`, () => {
                let result: Date;

                beforeEach(() => {
                    result = calculateStartOfMonthWithOffset(entry.input, entry.offset);
                });

                it(`should be ${entry.expected}`, () => {
                    expect(result).toEqual(entry.expected);
                })
            })
        });
    });
});