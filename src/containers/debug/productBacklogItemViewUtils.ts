// components
import { ProductBacklogItemGroup, ProductBacklogItemItem, RankItemType } from "./ProductBacklogItemView";

// state
import { StateTree } from "../../reducers/rootReducer";

// selectors
import { getProductBacklogItems } from "../../selectors/productBacklogItemSelectors";

// interfaces/types
import { ProductBacklogItem } from "../../reducers/productBacklogItemsReducer";
import { AvailableProductBacklogItem, removeAvailableItem } from "./availableItemsUtils";

export interface LinkCountObj {
    [id: string]: { linkCount: number; inPrevList: boolean; inNextList: boolean };
}

const getIdLinkCount = (linkCountObj: LinkCountObj, id: string | null) => linkCountObj[`${null}`]?.linkCount || 0;

const handleNewList = (
    groupItems: ProductBacklogItemItem[],
    availableItems: AvailableProductBacklogItem[],
    firstItem: ProductBacklogItem,
    lastItemAdded: ProductBacklogItemItem,
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

const handleFirstItemFromAvailableList = (availableItems: AvailableProductBacklogItem[]): ProductBacklogItem => {
    let firstItem: ProductBacklogItem;
    // there should not be multiple lists, but there are, so we need to find the start of these lists and iterate
    // through them just like we did in handleNewList for the first list
    const listStartItems = availableItems.filter((item) => item.backlogItemId === null);
    const hadStartItem = !!listStartItems.length;
    if (hadStartItem) {
        // this is a "normal" start of a list
        firstItem = listStartItems[0];
        removeAvailableItem(availableItems, firstItem);
    } else {
        let currentItem = availableItems[0];
        // this is just some arbitrary item, we know it isn't the beginning of a list, but it might be orphaned so
        // we need to follow the chain of items that leads to it
        firstItem = null;
        let visitedIds = new Set<string>();
        while (!firstItem) {
            let itemsFound = availableItems.filter((item) => item.nextBacklogItemId === currentItem.backlogItemId);
            if (itemsFound.length) {
                currentItem = itemsFound[0];
                if (visitedIds.has(currentItem.id)) {
                    // can't find a true "first item", we're looping through the same list, so just return top of list item
                    firstItem = currentItem;
                    removeAvailableItem(availableItems, firstItem);
                }
                visitedIds.add(currentItem.id);
            } else {
                firstItem = currentItem;
                removeAvailableItem(availableItems, firstItem);
            }
        }
    }
    return firstItem;
};

const handleNewGroup = (
    groups: ProductBacklogItemGroup[],
    availableItems: AvailableProductBacklogItem[],
    firstItem: ProductBacklogItem,
    linkCountObj: LinkCountObj
) => {
    const group: ProductBacklogItemGroup = {
        items: []
    };
    groups.push(group);
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

export interface RankInfo {
    rank: ProductBacklogItem;
    processed: boolean;
}

export const buildKeyFromId = (id: string | null | undefined) => {
    return !id ? "<<null>>" : `${id}`;
};

export const findCircularRefs = (allRanks: ProductBacklogItem[]) => {
    let hasIssues = false;
    let message = "";
    const projectIdSet = new Set();
    allRanks.forEach((rank) => {
        if (!projectIdSet.has(rank.projectId)) {
            projectIdSet.add(rank.projectId);
        }
    });
    let nullProjectIdEntryCount = 0;
    projectIdSet.forEach((projectId) => {
        if (!projectId) {
            nullProjectIdEntryCount++;
        }
        const ranks = allRanks.filter((rank) => rank.projectId === projectId);

        let repeatedBacklogItemIds: string[] = [];

        if (ranks.length) {
            const rankInfoByKey: { [id: string]: RankInfo } = {};
            ranks.forEach((rank) => {
                const key = buildKeyFromId(rank.backlogItemId);
                if (!rankInfoByKey[key]) {
                    rankInfoByKey[key] = { rank, processed: false };
                } else {
                    hasIssues = true;
                    repeatedBacklogItemIds.push(`${rank.id} => ${rank.backlogItemId}`);
                }
            });
            let currentRankInfo = rankInfoByKey[buildKeyFromId(null)];
            if (!currentRankInfo) {
                const firstKey = buildKeyFromId(ranks[0].backlogItemId);
                currentRankInfo = rankInfoByKey[firstKey];
            }
            let busy = true;
            while (busy) {
                if (currentRankInfo.processed) {
                    message = `circular ref found: ${currentRankInfo.rank.backlogItemId}`;
                    busy = false;
                    hasIssues = true;
                    continue;
                }
                currentRankInfo.processed = true;
                const nextId = currentRankInfo.rank.nextBacklogItemId;
                if (!nextId) {
                    currentRankInfo = null;
                } else {
                    const key = buildKeyFromId(nextId);
                    currentRankInfo = rankInfoByKey[key];
                }
                if (!currentRankInfo) {
                    const keys = Object.keys(rankInfoByKey);
                    let idx = 0;
                    let searchingForUnprocessedRank = idx < keys.length;
                    while (searchingForUnprocessedRank) {
                        const key = keys[idx++];
                        const rankInfo = rankInfoByKey[key];
                        if (!rankInfo.processed) {
                            currentRankInfo = rankInfo;
                            searchingForUnprocessedRank = false;
                        } else if (idx >= keys.length) {
                            searchingForUnprocessedRank = false;
                        }
                    }
                    if (!currentRankInfo) {
                        busy = false;
                    }
                }
            }
        }

        if (repeatedBacklogItemIds.length) {
            if (message) {
                message += "; ";
            }
            message += `for project ID ${projectId}, repeated product backlog item IDs: ${repeatedBacklogItemIds.join(", ")}`;
        }
    });
    if (nullProjectIdEntryCount > 0) {
        if (message) {
            message += "; ";
        }
        message += `there are ${nullProjectIdEntryCount} null projectId entries!`;
    }
    return {
        hasIssues,
        message
    };
};

export const buildGroups = (state: StateTree) => {
    const buildNewGroups = () => {
        const groups: ProductBacklogItemGroup[] = [];
        return groups;
    };
    const groups = buildNewGroups();
    const ranks = getProductBacklogItems(state);
    const circularRefResult = findCircularRefs(ranks);
    if (circularRefResult.hasIssues) {
        throw new Error(circularRefResult.message);
    }
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
    const availableItems: AvailableProductBacklogItem[] = ranks.map((rank) => ({ ...rank, linkCount: -1 }));
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
