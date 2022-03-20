// interfaces/types
import { ApiBacklogItemPart } from "../types/apiModelTypes";
import { BacklogItemPart } from "../types/backlogItemPartTypes";

// utils
import { dateToIsoDateString, isoDateStringToDate } from "../utils/apiPayloadConverters";
import { mapApiStatusToBacklogItem, mapBacklogItemStatusToApi } from "./statusMappers";

export const mapApiItemToBacklogItemPart = (apiItem: ApiBacklogItemPart): BacklogItemPart => ({
    id: apiItem.id,
    externalId: apiItem.externalId,
    backlogItemId: apiItem.backlogitemId,
    partIndex: apiItem.partIndex,
    percentage: apiItem.percentage,
    points: apiItem.points,
    startedAt: isoDateStringToDate(apiItem.startedAt),
    finishedAt: isoDateStringToDate(apiItem.finishedAt),
    status: mapApiStatusToBacklogItem(apiItem.status)
});

export const mapBacklogItemPartToApiItem = (item: Partial<BacklogItemPart>): ApiBacklogItemPart => ({
    id: item.id,
    externalId: item.externalId,
    backlogitemId: item.backlogItemId,
    partIndex: item.partIndex,
    percentage: item.percentage,
    points: item.points,
    startedAt: dateToIsoDateString(item.startedAt),
    finishedAt: dateToIsoDateString(item.finishedAt),
    status: mapBacklogItemStatusToApi(item.status)
});
