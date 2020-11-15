// externals
import { Draft, produce } from "immer";
import urlParse from "url-parse";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types";
import { ApiGetBacklogItemsSuccessAction } from "../actions/apiBacklogItems";
import { ApiGetBffViewsPlanSuccessAction } from "../actions/apiBffViewsPlan";
import { ApiBacklogItem } from "../apiModelTypes";
import { ApiActionMetaDataRequestMeta } from "../middleware/apiTypes";

export const ResourceTypes = {
    BACKLOG_ITEM: "backlogItems"
};

export interface ApiLinkDefn {
    type: string;
    uri: string;
}

export interface ApiLinksForTypeUri {
    [rel: string]: ApiLinkDefn | null;
}

export interface ApiLinksForType {
    [id: string]: ApiLinksForTypeUri;
}

export interface ApiLinkState {
    linksByType: { [key: string]: ApiLinksForType };
}

export const apiLinksReducerInitialState = Object.freeze<ApiLinkState>({
    linksByType: {
        backlogItems: {}
    }
});

export const getLinkForItem = (state: ApiLinkState, itemType: string, rel: string, itemId: string): ApiLinkDefn | null => {
    const forItemType = state.linksByType[itemType];
    if (!forItemType) {
        return null;
    }
    const forItemId = forItemType[itemId];
    if (!forItemId) {
        return null;
    }
    return forItemId[rel] || null;
};

export const buildUri = (requestUrl: string, linkUri: string): string => {
    if (!linkUri.startsWith("/")) {
        throw new Error(`Unable to handle link URI "${linkUri}" returned by "${requestUrl}"`);
    }
    const parsed = urlParse(requestUrl);
    const usePort = !!parsed.port && `${parsed.port}` !== "80" && `${parsed.port}` !== "443";
    const hostAndPort = usePort ? `${parsed.hostname}:${parsed.port}` : parsed.hostname;
    return `${parsed.protocol}//${hostAndPort}${linkUri}`;
};

export const processBacklogItems = (
    backlogItems: ApiBacklogItem[],
    draft: Draft<ApiLinkState>,
    meta: ApiActionMetaDataRequestMeta
) => {
    backlogItems.forEach((item) => {
        if (item.links?.length) {
            item.links.forEach((link) => {
                if (link.rel === "self") {
                    const resourceLinks = draft.linksByType[ResourceTypes.BACKLOG_ITEM];
                    if (!resourceLinks[item.id]) {
                        resourceLinks[item.id] = { item: null };
                    }
                    resourceLinks[item.id].item = {
                        type: link.type,
                        uri: buildUri(meta.requestBody.url, link.uri)
                    };
                }
            });
        }
    });
};

export const apiLinksReducer = (state: ApiLinkState = apiLinksReducerInitialState, action: AnyFSA): ApiLinkState =>
    produce(state, (draft) => {
        switch (action.type) {
            case ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS: {
                const actionTyped = action as ApiGetBacklogItemsSuccessAction;
                const { payload } = actionTyped;
                processBacklogItems(payload.response.data.items, draft, actionTyped.meta);
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                processBacklogItems(payload.response.data.backlogItems, draft, actionTyped.meta);
                return;
            }
        }
    });
