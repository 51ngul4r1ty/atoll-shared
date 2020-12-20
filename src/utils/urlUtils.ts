export const encodeForUrl = (val: string): string => {
    return encodeURIComponent(val.toLowerCase());
};

export const decodeFromUrl = (val: string): string => {
    return decodeURIComponent(val);
};
