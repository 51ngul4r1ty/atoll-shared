// state
import { StateTree } from "../reducers/rootReducer";

// reducers
import { ApiLinkDefnMissingReason, getLinkForItem } from "../reducers/apiLinksReducer";

export interface ApiPayloadBase {
    endpoint?: string;
    headers?: { [header: string]: string };
}

export const mapToHeaderValue = (type: string): string => {
    // one-to-one mapping (For now)
    return type;
};

export const buildApiPayloadBaseForResource = (state: StateTree, resource: string, rel: string, itemId: string): ApiPayloadBase => {
    const linkForItemInfo = getLinkForItem(state.apiLinks, resource, rel, itemId);
    const linkForItem = linkForItemInfo.link;
    if (!linkForItem) {
        let reason: string;
        switch (linkForItemInfo.missingReason) {
            case ApiLinkDefnMissingReason.TypeNotFound: {
                reason = `resource type "${resource}" not found`;
                break;
            }
            case ApiLinkDefnMissingReason.ItemNotFound: {
                reason = `resource item "${itemId}" not found`;
                break;
            }
            case ApiLinkDefnMissingReason.RelNotFound: {
                reason = `resource rel ${rel} not found`;
                break;
            }
            default: {
                reason = `unknown reason "${linkForItemInfo.missingReason}"`;
                break;
            }
        }
        throw new Error(`Unable to obtain a "${rel}" link for a "${resource}" item with ID "${itemId} ("${reason}")`);
    }
    const endpoint = linkForItem.uri;
    return {
        endpoint,
        headers: {
            "Content-Type": mapToHeaderValue(linkForItem.type),
            Accept: mapToHeaderValue(linkForItem.type)
        }
    };
};
