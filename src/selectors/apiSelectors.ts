// consts/enums
import { APPLICATION_JSON } from "../constants";

// interfaces/types
import { ApiMethods } from "../middleware/apiTypes";

// state
import { StateTree } from "../types";

// reducers
import { getLinkForItem } from "../reducers/apiLinksReducer";

export interface ApiPayloadBase {
    endpoint?: string;
    headers?: { [header: string]: string };
}

export const mapToHeaderValue = (type: string): string => {
    // one-to-one mapping (For now)
    return type;
};

export const buildApiPayloadBaseForResource = (state: StateTree, resource: string, rel: string, itemId: string): ApiPayloadBase => {
    const linkForItem = getLinkForItem(state.apiLinks, resource, rel, itemId);
    const endpoint = linkForItem.uri;
    return {
        endpoint,
        headers: {
            "Content-Type": mapToHeaderValue(linkForItem.type),
            Accept: mapToHeaderValue(linkForItem.type)
        }
    };
};
