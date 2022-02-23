// externals
import { immerable } from "immer";

// utils
import { addDays, stringToDate } from "../utils/dateHelper";
import { formatNumber } from "../utils/formatter";

export class DateOnly {
    private year: number;
    private month: number;
    private day: number;
    /**
     * Create a new DateOnly object using year, month (starting at 1) and day values.
     * @param year any year value
     * @param month 1 to 12
     * @param day 1 to 31 (depending on month)
     */
    constructor(...args: number[]) {
        this[immerable] = true;
        if (args.length > 3) {
            throw new Error(`Too many arguments (${args.length}) when constructing DateOnly instance`);
        } else if (args.length > 0 && args.length < 3) {
            throw new Error(`Too few arguments (${args.length}) when constructing DateOnly instance (expected 0 or 3)`);
        } else if (args.length === 0) {
            const date = new Date();
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.day = date.getDate();
        } else {
            this.year = args[0];
            this.month = args[1];
            this.day = args[2];
        }
    }
    static fromDate(date: Date | null | undefined): DateOnly | null {
        if (!date) {
            return null;
        }
        const result = new DateOnly();
        result.year = date.getFullYear();
        result.month = date.getMonth() + 1;
        result.day = date.getDate();
        return result;
    }
    static fromString(text: string): DateOnly | null {
        const date = stringToDate(text);
        if (date === null) {
            return null;
        }
        return DateOnly.fromDate(date);
    }
    static fromISODate(value: string): DateOnly | null {
        if (!value) {
            return null;
        }
        if (value.indexOf("T") >= 0 || value.indexOf("Z") >= 0) {
            throw new Error(`Parsing error: unexpected value "${value}" that does not appear to be a date-only ISO string.`);
        }
        const parts = value.split("-");
        if (parts.length !== 3) {
            throw new Error(`Parsing error: expected 3 parts to ISO Date string ("${value}"), got ${parts.length} parts.`);
        }
        const yearPart = parts[0];
        const monthPart = parts[1];
        const dayPart = parts[2];
        const date = new DateOnly();
        date.year = parseInt(yearPart);
        date.month = parseInt(monthPart);
        date.day = parseInt(dayPart);
        return date;
    }
    clone(): DateOnly {
        const result = new DateOnly();
        result.year = this.year;
        result.month = this.month;
        result.day = this.day;
        return result;
    }
    addDays(days: number): DateOnly {
        const date = new Date(this.year, this.month - 1, this.day, 12); // create noon date to avoid DST issues
        const newDate = addDays(date, days);
        const result = new DateOnly();
        result.year = newDate.getFullYear();
        result.month = newDate.getMonth() + 1;
        result.day = newDate.getDate();
        return result;
    }
    toISODate(): string {
        return `${formatNumber(this.year, 4)}-${formatNumber(this.month, 2)}-${formatNumber(this.day, 2)}`;
    }
    toISODateTime(): string {
        const datePart = this.toISODate();
        const timePart = "00:00:00.000";
        return `${datePart}T${timePart}Z`;
    }
    toSimpleValue(): number {
        return this.year * 100000 + this.month * 100 + this.day;
    }
    static dateToSimpleValue(date: DateOnly, defaultForFalsy: number = 0): number {
        if (!date) {
            return defaultForFalsy;
        }
        return date.toSimpleValue();
    }
    eq(date: DateOnly): boolean {
        const simpleVal1 = this.toSimpleValue();
        const simpleVal2 = date.toSimpleValue();
        return simpleVal1 === simpleVal2;
    }
    gte(date: DateOnly): boolean {
        const simpleVal1 = this.toSimpleValue();
        const simpleVal2 = date.toSimpleValue();
        return simpleVal1 >= simpleVal2;
    }
    lt(date: DateOnly): boolean {
        const simpleVal1 = this.toSimpleValue();
        const simpleVal2 = date.toSimpleValue();
        return simpleVal1 < simpleVal2;
    }
    lte(date: DateOnly): boolean {
        const simpleVal1 = this.toSimpleValue();
        const simpleVal2 = date.toSimpleValue();
        return simpleVal1 <= simpleVal2;
    }
    formatAsText(): string {
        const date = new Date(this.year, this.month - 1, this.day);
        const datePart = date.toLocaleDateString();
        return datePart;
    }
    getYear(): number {
        return this.year;
    }
    getMonth(): number {
        return this.month;
    }
    getMonthIndex(): number {
        return this.month - 1;
    }
    getDay(): number {
        return this.day;
    }
    getDayOfWeek(): number {
        const date = new Date(this.year, this.month - 1, this.day);
        return date.getDay();
    }
}

export type ISODateString = string;
