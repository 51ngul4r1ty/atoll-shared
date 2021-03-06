// externals
import { Draft, produce } from "immer";
import urlParse from "url-parse";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types/reactHelperTypes";
import { ApiGetBacklogItemsSuccessAction } from "../actions/apiBacklogItems";
import { ApiGetBffViewsPlanSuccessAction } from "../actions/apiBffViewsPlan";
import { ApiItemWithLinks, ItemWithId } from "../apiModelTypes";
import { ApiActionMetaDataRequestMeta } from "../middleware/apiTypes";
import { ApiGetBffViewsBacklogItemSuccessAction } from "../actions/apiBffViewsBacklogItem";
import { ApiGetSprintsSuccessAction } from "../actions/apiSprints";

export const ResourceTypes = {
    BACKLOG_ITEM: "backlogItems",
    SPRINT: "sprints"
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
        backlogItems: {},
        sprints: {}
    }
});

export enum ApiLinkDefnMissingReason {
    None = 0,
    TypeNotFound = 1,
    ItemNotFound = 2,
    RelNotFound = 3
}

export interface LinkForItemResult {
    link: ApiLinkDefn | null;
    missingReason?: ApiLinkDefnMissingReason;
}

export const getLinkForItem = (state: ApiLinkState, itemType: string, rel: string, itemId: string): LinkForItemResult => {
    const forItemType = state.linksByType[itemType];
    if (!forItemType) {
        return {
            link: null,
            missingReason: ApiLinkDefnMissingReason.TypeNotFound
        };
    }
    const forItemId = forItemType[itemId];
    if (!forItemId) {
        return {
            link: null,
            missingReason: ApiLinkDefnMissingReason.ItemNotFound
        };
    }
    const result = forItemId[rel];
    if (!result) {
        return {
            link: null,
            missingReason: ApiLinkDefnMissingReason.RelNotFound
        };
    }
    return {
        link: result,
        missingReason: ApiLinkDefnMissingReason.None
    };
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

export const processItems = <T extends ApiItemWithLinks & ItemWithId>(
    itemTypeLinkName: string,
    items: T[],
    draft: Draft<ApiLinkState>,
    meta: ApiActionMetaDataRequestMeta
) => {
    items.forEach((item) => {
        if (item.links?.length) {
            item.links.forEach((link) => {
                if (link.rel === "self") {
                    const resourceLinks = draft.linksByType[itemTypeLinkName];
                    if (!resourceLinks) {
                        throw new Error(`Unable to find linksByType base entry for ${itemTypeLinkName}`);
                    } else {
                        if (!resourceLinks[item.id]) {
                            resourceLinks[item.id] = { item: null };
                        }
                        resourceLinks[item.id].item = {
                            type: link.type,
                            uri: buildUri(meta.requestBody.url, link.uri)
                        };
                    }
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
                processItems(ResourceTypes.BACKLOG_ITEM, payload.response.data.items, draft, actionTyped.meta);
                return;
            }
            case ActionTypes.API_GET_SPRINTS_SUCCESS: {
                const actionTyped = action as ApiGetSprintsSuccessAction;
                const { payload } = actionTyped;
                processItems(ResourceTypes.SPRINT, payload.response.data.items, draft, actionTyped.meta);
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                processItems(ResourceTypes.BACKLOG_ITEM, payload.response.data.backlogItems, draft, actionTyped.meta);
                processItems(ResourceTypes.SPRINT, payload.response.data.sprints, draft, actionTyped.meta);
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsBacklogItemSuccessAction;
                const { payload } = actionTyped;
                processItems(ResourceTypes.BACKLOG_ITEM, payload.response.data.backlogItems, draft, actionTyped.meta);
                return;
            }
        }
    });
