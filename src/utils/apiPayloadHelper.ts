// interfaces/types
import { BacklogItemModel, BacklogItem } from "../reducers/backlogItemsReducer";

export const convertToBacklogItemModel = (backlogItem: BacklogItem): BacklogItemModel => ({
    creationDateTime: backlogItem.creationDateTime,
    // displayIndex: backlogItem.displayIndex,
    estimate: backlogItem.estimate,
    externalId: backlogItem.externalId,
    id: backlogItem.id,
    reasonPhrase: backlogItem.reasonPhrase,
    rolePhrase: backlogItem.rolePhrase,
    storyPhrase: backlogItem.storyPhrase,
    type: backlogItem.type
});
