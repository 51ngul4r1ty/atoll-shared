// externals
import { Draft, produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA } from "../types/reactHelperTypes";
import { ApiGetBacklogItemsSuccessAction } from "../actions/apiBacklogItems";
import { ApiGetBffViewsPlanSuccessAction } from "../actions/apiBffViewsPlan";
import { ApiItemWithLinks, ItemWithId } from "../types/apiModelTypes";
import { ApiActionMetaDataRequestMeta } from "../middleware/apiTypes";
import { ApiGetBffViewsBacklogItemSuccessAction } from "../actions/apiBffViewsBacklogItem";
import { ApiGetSprintsSuccessAction, ApiGetSprintSuccessAction } from "../actions/apiSprints";

// utils
import { buildFullUri } from "../utils/apiLinkHelper";

export const ResourceTypes = {
    BACKLOG_ITEM: "backlogItems",
    BACKLOG_ITEM_PART: "backlogItemParts",
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
        sprints: {},
        backlogItemParts: {}
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

/**
 * Finds HATEOAS links in the REST API response and stores them for use later.
 * @param itemTypeLinkName used to catalog the HATEOAS links for later retrieval
 * @param item object from API response that contains HATEOAS links
 * @param draft state to be updated with links found
 * @param meta used to retrieve the REST API request body
 */
export const processItem = <T extends ApiItemWithLinks & ItemWithId>(
    itemTypeLinkName: string,
    item: T,
    draft: Draft<ApiLinkState>,
    meta: ApiActionMetaDataRequestMeta<any, any, any, any>
) => {
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
                        uri: buildFullUri(meta.requestBody, link.uri)
                    };
                }
            }
        });
    }
};

export const processItems = <T extends ApiItemWithLinks & ItemWithId>(
    itemTypeLinkName: string,
    items: T[],
    draft: Draft<ApiLinkState>,
    meta: ApiActionMetaDataRequestMeta,
    debugName: string
) => {
    if (!items) {
        throw new Error(`Unexpected condition- items array is undefined in processItems (${debugName})`);
    }
    items.forEach((item) => {
        processItem(itemTypeLinkName, item, draft, meta);
    });
};

export const apiLinksReducer = (state: ApiLinkState = apiLinksReducerInitialState, action: AnyFSA): ApiLinkState =>
    produce(state, (draft) => {
        switch (action.type) {
            case ActionTypes.API_GET_BACKLOG_ITEMS_SUCCESS: {
                const actionTyped = action as ApiGetBacklogItemsSuccessAction;
                const { payload } = actionTyped;
                processItems(
                    ResourceTypes.BACKLOG_ITEM,
                    payload.response.data.items,
                    draft,
                    actionTyped.meta,
                    "apiLinksReducer - API_GET_BACKLOG_ITEMS_SUCCESS"
                );
                return;
            }
            case ActionTypes.API_GET_SPRINTS_SUCCESS: {
                const actionTyped = action as ApiGetSprintsSuccessAction;
                const { payload } = actionTyped;
                processItems(
                    ResourceTypes.SPRINT,
                    payload.response.data.items,
                    draft,
                    actionTyped.meta,
                    "apiLinksReducer - API_GET_SPRINTS_SUCCESS"
                );
                return;
            }
            case ActionTypes.API_GET_SPRINT_SUCCESS: {
                const actionTyped = action as ApiGetSprintSuccessAction;
                const { payload } = actionTyped;
                processItem(ResourceTypes.SPRINT, payload.response.data.item, draft, actionTyped.meta);
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                processItems(
                    ResourceTypes.BACKLOG_ITEM,
                    payload.response.data.backlogItems,
                    draft,
                    actionTyped.meta,
                    "apiLinksReducer - API_GET_BFF_VIEWS_PLAN_SUCCESS - BACKLOG_ITEM"
                );
                processItems(
                    ResourceTypes.SPRINT,
                    payload.response.data.sprints,
                    draft,
                    actionTyped.meta,
                    "apiLinksReducer - API_GET_BFF_VIEWS_PLAN_SUCCESS - SPRINT"
                );
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsBacklogItemSuccessAction;
                const { payload } = actionTyped;
                processItems(
                    ResourceTypes.BACKLOG_ITEM,
                    [payload.response.data.backlogItem],
                    draft,
                    actionTyped.meta,
                    "apiLinksReducer - API_GET_BFF_VIEWS_BACKLOG_ITEM_SUCCESS (backlog item)"
                );
                const backlogItemPartItems = payload.response.data.backlogItemPartsAndSprints.map((item) => item.part);
                processItems(
                    ResourceTypes.BACKLOG_ITEM_PART,
                    backlogItemPartItems,
                    draft,
                    actionTyped.meta,
                    "apiLinksReducer - API_GET_BFF_VIEWS_BACKLOG_ITEM_SUCCESS (backlog item parts)"
                );
                const sprintItems = payload.response.data.backlogItemPartsAndSprints
                    .map((partAndSprint) => partAndSprint.sprint)
                    .filter((sprint) => sprint !== null);
                processItems(
                    ResourceTypes.SPRINT,
                    sprintItems,
                    draft,
                    actionTyped.meta,
                    "apiLinksReducer - API_GET_BFF_VIEWS_BACKLOG_ITEM_SUCCESS (sprints)"
                );
                return;
            }
        }
    });
