// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import {
    BacklogItemRankGroup,
    BacklogItemRankItem,
    BacklogItemRankView,
    BacklogItemRankViewDispatchProps,
    BacklogItemRankViewStateProps,
    RankItemType
} from "./BacklogItemRankView";
import { StateTree } from "../../types";

// actions
import { apiGetBacklogItemRanks } from "../../actions/apiBacklogItemRanks";

// selectors
import { getBacklogItemRanks } from "../../selectors/backlogItemRankSelectors";
import { BacklogItemRank } from "../../reducers/backlogItemRanksReducer";

export interface AvailableRankItem extends BacklogItemRank {
    linkCount: number;
}

export interface LinkCountObj {
    [id: string]: { linkCount: number; inPrevList: boolean; inNextList: boolean };
}

const removeAvailableItem = (availableItems: BacklogItemRank[], item: BacklogItemRank) => {
    const countBefore = availableItems.length;
    const idx = availableItems.indexOf(item);
    if (idx) {
        availableItems.splice(idx, 1);
    } else {
        let i = 0;
        let itemCount = availableItems.length;
        let busy = i < itemCount;
        while (busy) {
            if (
                availableItems[i].id === item.id &&
                availableItems[i].backlogItemId === item.backlogItemId &&
                availableItems[i].nextBacklogItemId === item.nextBacklogItemId
            ) {
                availableItems.splice(i, 1);
                busy = false;
            } else {
                busy = i < itemCount;
            }
            i++;
        }
    }
    const countAfter = availableItems.length;
    if (countBefore <= countAfter) {
        throw new Error(`Unable to remove item - ${item.id}`);
    }
};

const getIdLinkCount = (linkCountObj: LinkCountObj, id: string | null) => linkCountObj[`${null}`]?.linkCount || 0;

const handleNewList = (
    groupItems: BacklogItemRankItem[],
    availableItems: AvailableRankItem[],
    firstItem: BacklogItemRank,
    lastItemAdded: BacklogItemRankItem,
    linkCountObj: LinkCountObj
) => {
    let itemsFound = availableItems.filter((item) => item.backlogItemId === firstItem.nextBacklogItemId);
    if (itemsFound.length === 0) {
        // start of list with nothing after it
        lastItemAdded.itemType = RankItemType.OrphanedListStartEnd;
    } else {
        let itemFound = itemsFound[0];
        let busy = true;
        let orphanedEnd = true;
        while (busy) {
            removeAvailableItem(availableItems, itemFound);
            lastItemAdded = {
                itemText: itemFound.backlogItemId,
                nextText: itemFound.nextBacklogItemId,
                itemType: RankItemType.Middle,
                linkCount: getIdLinkCount(linkCountObj, itemFound.backlogItemId)
            };
            groupItems.push(lastItemAdded);
            const nextId = itemFound.nextBacklogItemId;
            if (!nextId) {
                busy = false;
                orphanedEnd = false;
            } else {
                const nextItemsFound = availableItems.filter((item) => item.backlogItemId === itemFound.nextBacklogItemId);
                itemFound = nextItemsFound[0];
            }
        }
        if (orphanedEnd) {
            lastItemAdded.itemType = RankItemType.OrphanedListEnd;
        } else {
            lastItemAdded.itemType = RankItemType.ListEnd;
        }
    }
};

const handleFirstItemFromAvailableList = (availableItems: AvailableRankItem[]): BacklogItemRank => {
    let firstItem: BacklogItemRank;
    // there should not be multiple lists, but there are, so we need to find the start of these lists and iterate
    // through them just like we did in handleNewList for the first list
    const listStartItems = availableItems.filter((item) => item.backlogItemId === null);
    if (listStartItems.length) {
        // this is a "normal" start of a list
        firstItem = listStartItems[0];
        removeAvailableItem(availableItems, firstItem);
    } else {
        let currentItem = availableItems[0];
        // this is just some arbitrary item, we know it isn't the beginning of a list, but it might be orphaned so
        // we need to follow the chain of items that leads to it
        firstItem = null;
        while (!firstItem) {
            let itemsFound = availableItems.filter((item) => item.nextBacklogItemId === currentItem.backlogItemId);
            if (itemsFound.length) {
                currentItem = itemsFound[0];
            } else {
                firstItem = currentItem;
                removeAvailableItem(availableItems, firstItem);
            }
        }
    }
    return firstItem;
};

const handleNewGroup = (
    groups: BacklogItemRankGroup[],
    availableItems: AvailableRankItem[],
    firstItem: BacklogItemRank,
    linkCountObj: LinkCountObj
) => {
    const group: BacklogItemRankGroup = {
        items: []
    };
    groups.push(group);
    let lastItemAdded = {
        itemText: firstItem.backlogItemId || "NULL",
        nextText: firstItem.nextBacklogItemId,
        itemType: firstItem.backlogItemId ? RankItemType.OrphanedListStart : RankItemType.ListStart,
        linkCount: getIdLinkCount(linkCountObj, null)
    };
    group.items.push(lastItemAdded);
    let busy = true;
    while (busy) {
        handleNewList(group.items, availableItems, firstItem, lastItemAdded, linkCountObj);
        if (!availableItems.length) {
            busy = false;
        } else {
            firstItem = handleFirstItemFromAvailableList(availableItems);
        }
    }
};

const mapStateToProps = (state: StateTree): BacklogItemRankViewStateProps => {
    // TODO: Add logic to handle a circular reference (it should check to see if it encounters the same ID more than once)
    //       - could probably use the "filter" results and check if more than one item is returned each time
    const buildNewGroups = () => {
        const groups: BacklogItemRankGroup[] = [];
        return groups;
    };
    const groups = buildNewGroups();
    const ranks = getBacklogItemRanks(state);
    const listStartItems = ranks.filter((item) => item.backlogItemId === null);
    const linkCountObj: LinkCountObj = {};
    ranks.forEach((rank) => {
        linkCountObj[`${rank.backlogItemId}`] = {
            linkCount: 0,
            inPrevList: true,
            inNextList: false
        };
    });
    ranks.forEach((rank) => {
        const matchItem = linkCountObj[`${rank.nextBacklogItemId}`];
        if (!matchItem) {
            linkCountObj[`${rank.nextBacklogItemId}`] = {
                linkCount: 1,
                inPrevList: false,
                inNextList: true
            };
        } else {
            linkCountObj[`${rank.nextBacklogItemId}`].linkCount++;
            linkCountObj[`${rank.nextBacklogItemId}`].inNextList = true;
        }
    });
    const availableItems: AvailableRankItem[] = ranks.map((rank) => ({ ...rank, linkCount: -1 }));
    if (listStartItems.length) {
        let firstItem = listStartItems[0];
        removeAvailableItem(availableItems, firstItem);
        handleNewGroup(groups, availableItems, firstItem, linkCountObj);
    } else if (availableItems.length) {
        let firstItem = handleFirstItemFromAvailableList(availableItems);
        handleNewGroup(groups, availableItems, firstItem, linkCountObj);
    }
    const result: BacklogItemRankViewStateProps = {
        groups
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): BacklogItemRankViewDispatchProps => {
    return {
        onLoad: () => {
            dispatch(apiGetBacklogItemRanks());
        }
    };
};

export const BacklogItemRankViewContainer = connect(mapStateToProps, mapDispatchToProps)(BacklogItemRankView);
