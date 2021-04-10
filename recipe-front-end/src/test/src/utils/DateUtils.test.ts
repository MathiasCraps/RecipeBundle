import { DateRange } from '../../../redux/Store';
import { addDays, calculateStartOfDate, calculateStartOfMonthWithOffset, clipDate, dateIsInRange, FULL_DAY_IN_MS, isSameUtcDay, normalizeWeekDay, parseDateRange } from '../../../utils/DateUtils';

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

                test(`should be ${entry.expected}`, () => {
                    expect(result).toEqual(entry.expected);
                });
            });
        });
    });

    describe('addDays', () => {
        const TEST_DATE = new Date(2021, 1, 1);
        let output: Date;

        describe('called with +1', () => {
            beforeEach(() => {
                output = addDays(TEST_DATE, 1);
            });

            test('should add 86400 seconds', () => {
                expect(output.getTime()).toBe(TEST_DATE.getTime() + 86400 * 1000);
            });
        });
    });

    describe('dateIsInRange', () => {
        const start = new Date(2020, 1, 1);
        const end = new Date(2020, 6, 1);
        [
            { reference: new Date(2020, 1, 1), expectation: true },
            { reference: new Date(2020, 6, 1), expectation: true },
            { reference: new Date(2020, 3, 1), expectation: true },
            { reference: new Date(2019, 1, 1), expectation: false },
            { reference: new Date(2020, 7, 1), expectation: false },
        ].forEach((entry) => {
            let result: boolean;
            describe(`called with ${entry} on a range of ${start} to ${end}`, () => {
                result = dateIsInRange(entry.reference, start, end)
            });

            test(`should ${entry.expectation ? 'be in range' : 'not be in range'}`, () => {
                expect(result).toBe(entry.expectation);
            });
        });
    });

    describe('parseDateRange', () => {
        describe('called with date 2021-1-1 - 2021-1-7', () => {
            const TEST_RANGE = { start: new Date(2021, 0, 1), end: new Date(2021, 0, 7) };
            const TEST_RANGE_AS_STRING = JSON.stringify({ start: Number(TEST_RANGE.start), end: Number(TEST_RANGE.end) });

            [
                { nowTime: Number(TEST_RANGE.start), description: 'called at start of range' },
                { nowTime: Number(TEST_RANGE.start) + FULL_DAY_IN_MS, description: 'called during range' },
                { nowTime: Number(TEST_RANGE.end), description: 'called at end of range' }
            ].forEach((testEntry) => {
                describe(testEntry.description, () => {
                    let result: DateRange | undefined;
                    beforeEach(() => {
                        result = parseDateRange(TEST_RANGE_AS_STRING, testEntry.nowTime);
                    });
    
                    test('must return full range', () => {
                        expect(result).toEqual(TEST_RANGE);
                    });
                });
            });

            describe('called after end of range', () => {
                let result: DateRange | undefined;
                beforeEach(() => {
                    result = parseDateRange(TEST_RANGE_AS_STRING, Number(TEST_RANGE.end) + FULL_DAY_IN_MS);
                });

                test('must return undefined', () => {
                    expect(result).toEqual(undefined);
                })
            });
        });

        describe('called with invalid value', () => {
            let result: DateRange |  undefined;
            beforeEach(() => {
                result = parseDateRange('invalid', Number(new Date(2021, 0, 1)));
            });

            test('must return undefined', () => {
                expect(result).toBe(undefined);
            });
        });
    });

    describe('clipDate', () => {
        const LOWEST_CLIP_DATE = new Date(2021, 0, 1);
        const HIGHEST_CLIP_DATE = new Date(2021, 1, 1);
        const IN_CORRECT_RANGE = new Date(2021, 0, 17);
        const OUT_OF_RANGE_LOW = new Date(2020, 0, 1);
        const OUT_OF_RANGE_HIGH = new Date(2022, 0, 1);

        [
            // at clip edges
            { input: LOWEST_CLIP_DATE, output: LOWEST_CLIP_DATE },
            { input: HIGHEST_CLIP_DATE, output: HIGHEST_CLIP_DATE },

            // within ranges
            { input: IN_CORRECT_RANGE, output: IN_CORRECT_RANGE},

            // out of ranges
            { input: OUT_OF_RANGE_LOW, output: LOWEST_CLIP_DATE },
            { input: OUT_OF_RANGE_HIGH, output: HIGHEST_CLIP_DATE },
        ].forEach((entry) => {
            let output: Date;

            describe(`called with ${entry.input} for range ${LOWEST_CLIP_DATE} to ${HIGHEST_CLIP_DATE}`, () => {
                beforeEach(() => {
                    output = clipDate(entry.input, LOWEST_CLIP_DATE, HIGHEST_CLIP_DATE)
                });

                test(`should clip to ${entry.output}`, () => {
                    expect(output).toEqual(entry.output);
                });
            });
        });
    });
});