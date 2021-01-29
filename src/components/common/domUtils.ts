export const getParentWithDataClass = (elt: HTMLElement, dataClass: string) => {
    while (elt && elt.getAttribute("data-class") !== dataClass) {
        elt = elt.parentElement;
    }
    if (elt) {
        return elt;
    }
    return null;
};

export const getFirstParentWithAnyDataClass = (elt: HTMLElement) => {
    while (elt && !elt.getAttribute("data-class")) {
        elt = elt.parentElement;
    }
    if (elt) {
        return elt;
    }
    return null;
};

export const getEltDataClass = (elt: HTMLElement): string => getEltDataAttribute(elt, "class");

export const hasParentWithDataClass = (elt: HTMLElement, dataClass: string) => !!getParentWithDataClass(elt, dataClass);

export const getEltDataAttribute = (elt: HTMLElement, attributeName: string): string | null => {
    if (!elt) {
        return null;
    }
    const attrVal = elt.getAttribute(`data-${attributeName}`);
    return attrVal;
};
