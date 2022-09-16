export const getParentWithDataClass = (elt: Element, dataClass: string) => {
    while (elt && elt.getAttribute("data-class") !== dataClass) {
        elt = elt.parentElement;
    }
    if (elt) {
        return elt;
    }
    return null;
};

export const getFirstParentWithAnyDataClass = (elt: Element) => {
    while (elt && !elt.getAttribute("data-class")) {
        elt = elt.parentElement;
    }
    if (elt) {
        return elt;
    }
    return null;
};

export const getFirstElementAtXYWithAnyDataClass = (x: number, y: number) => {
    const elts = document.elementsFromPoint(x, y);
    if (!elts.length) {
        return null;
    }
    let idx = 0;
    while (idx < elts.length && elts[idx] && !elts[idx].getAttribute("data-class")) {
        idx++;
    }
    if (idx < elts.length) {
        return elts[idx];
    }
    return null;
};

export const getEltDataClass = (elt: Element): string => getEltDataAttribute(elt, "class");

export const hasParentWithDataClass = (elt: Element, dataClass: string) => !!getParentWithDataClass(elt, dataClass);

export const getEltDataAttribute = (elt: Element, attributeName: string): string | null => {
    if (!elt) {
        return null;
    }
    const attrVal = elt.getAttribute(`data-${attributeName}`);
    return attrVal;
};
