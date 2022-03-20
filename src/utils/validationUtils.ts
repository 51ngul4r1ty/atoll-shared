/**
 * Returns true if value contains a numeric value (float or integer).
 * @param value any type
 */
export const isNumber = (value: any): boolean => !isNaN(Number(value));

export const isValidStringEstimate = (value: string) => {
    if (value === "" || value === null || value === undefined) {
        return true;
    }
    const numericValue = Number(value);
    if (`${numericValue}` !== `${value}`) {
        return false;
    }
    return isValidEstimate(numericValue);
};

export const isValidStrictStringEstimate = (value: any): boolean => {
    if (value === "" || value === null || value === undefined) {
        return true;
    }
    const numericValue = Number(value);
    if (`${numericValue}` !== `${value}`) {
        return false;
    }
    return isValidStrictEstimate(numericValue);
};

export const isValidEstimate = (value: any): boolean => {
    if (value === undefined || value === null) {
        return true;
    }
    if (!isNumber(value)) {
        return false;
    }
    if (value === 0.5 || value === 0.25 || value === 0 || value === null || value === undefined) {
        return true;
    }
    if (value < 0 || value > 100) {
        return false;
    }
    return isInteger(value);
};

export const VALID_STORY_POINT_ESTIMATES = {
    0.25: true,
    0.5: true,
    1: true,
    2: true,
    3: true,
    5: true,
    8: true,
    13: true,
    20: true,
    40: true,
    100: true
};

export const isValidStrictEstimate = (value: any): boolean => {
    if (value === undefined || value === null) {
        return true;
    }
    if (!isNumber(value)) {
        return false;
    }
    if (VALID_STORY_POINT_ESTIMATES[value]) {
        return true;
    }
    return false;
};

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
