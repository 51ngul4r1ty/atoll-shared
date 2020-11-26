/**
 * Returns true if value contains a numeric value (float or integer).
 * @param value any type
 */
export const isNumber = (value: any): boolean => !isNaN(Number(value));

/**
 * Returns true only if the value is a number and it is integer.  If it is null or undefined this function returns false.
 * Whitespace is not ignored.
 * @param value any type
 */
export const isInteger = (value: any): boolean => {
    if (!isNumber(value)) {
        return false;
    }
    if (value === undefined || value === null) {
        return false;
    }
    const parsedValue = parseInt(value, 10);
    return `${parsedValue}` === `${value}`;
};
