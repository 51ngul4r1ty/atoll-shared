export const formatNumber = (value: number, length: number | undefined) => {
    if (!length) {
        return `${value}`;
    } else {
        let result = `${value}`;
        while (result.length < length) {
            result = "0" + result;
        }
        return result;
    }
};
