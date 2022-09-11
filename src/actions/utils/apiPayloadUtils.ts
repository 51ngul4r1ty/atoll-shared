import { ItemWithId } from "../../types/apiModelTypes";

export const stripUndefinedForPatchNoId = <T>(obj: T): Partial<T> => {
    const buildObjWithPrimativeProp = (obj: any, prop: string, node: any): any => {
        if (obj === undefined) {
            return { [prop]: node[prop] };
        } else {
            return { ...obj, [prop]: node[prop] };
        }
    };
    const buildObjWithPropFromSourceObj = (obj: any, prop: string, result: any): any => {
        if (obj === undefined) {
            return { [prop]: result };
        } else {
            return { ...obj, [prop]: result };
        }
    };
    const stripUndefinedForNode = (node: any): any => {
        let newObj: Partial<T>;
        for (let prop in node) {
            if (typeof node[prop] === "object") {
                const result = stripUndefinedForNode(node[prop]);
                if (result) {
                    newObj = buildObjWithPropFromSourceObj(newObj, prop, result);
                }
            } else {
                if (node[prop] !== undefined) {
                    newObj = buildObjWithPrimativeProp(newObj, prop, node);
                }
            }
        }
        return newObj;
    };
    const result = stripUndefinedForNode(obj);
    return { ...result };
};

export type StripUndefinedForPatchResult<T> = Partial<T> & ItemWithId;
export const stripUndefinedForPatch = <T>(obj: T, id: string): StripUndefinedForPatchResult<T> => {
    const result = stripUndefinedForPatchNoId(obj);
    return { ...result, id } || ({ id } as StripUndefinedForPatchResult<T>);
};
