// components
import { BacklogItemRankGroup, BacklogItemRankItem, RankItemType } from "./BacklogItemRankView";

// state
import { StateTree } from "../../types";

// selectors
import { getBacklogItemRanks } from "../../selectors/backlogItemRankSelectors";

// interfaces/types
import { BacklogItemRank } from "../../reducers/backlogItemRanksReducer";
import { AvailableRankItem, removeAvailableItem } from "./availableItemsUtils";

export interface LinkCountObj {
    [id: string]: { linkCount: number; inPrevList: boolean; inNextList: boolean };
}

const getIdLinkCount = (linkCountObj: LinkCountObj, id: string | null) => linkCountObj[`${null}`]?.linkCount || 0;

const handleNewList = (
    groupItems: BacklogItemRankItem[],
    availableItems: AvailableRankItem[],
    firstItem: BacklogItemRank,
    lastItemAdded: BacklogItemRankItem,
    linkCountObj: LinkCountObj
) => {
    console.log("LOG - point 6");
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
            console.log("LOG - point 7");
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
                console.log("LOG - point 8");
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
    console.log("LOG - point 1");
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
            console.log("LOG - point 2");
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
    console.log("LOG - point 3");
    let lastItemAdded = {
        itemText: firstItem.backlogItemId || "NULL",
        nextText: firstItem.nextBacklogItemId || "NULL",
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

export const buildGroups = (state: StateTree) => {
    // TODO: Add logic to handle a circular reference (it should check to see if it encounters the same ID more than once)
    //       - could probably use the "filter" results and check if more than one item is returned each time
    const buildNewGroups = () => {
        const groups: BacklogItemRankGroup[] = [];
        return groups;
    };
    const groups = buildNewGroups();
    const ranks = getBacklogItemRanks(state);
    console.log("LOG - point 4");
    const listStartItems = ranks.filter((item) => item.backlogItemId === null);
    const linkCountObj: LinkCountObj = {};
    ranks.forEach((rank) => {
        console.log("LOG - point 5");
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
    return groups;
};
