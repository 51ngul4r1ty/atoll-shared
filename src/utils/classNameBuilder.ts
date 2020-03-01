export const buildClassName = (...classNames: string[]) => {
    const itemsToUse = [];
    classNames.forEach((className) => {
        if (className) {
            itemsToUse.push(className);
        }
    });
    return itemsToUse.join(" ");
};
