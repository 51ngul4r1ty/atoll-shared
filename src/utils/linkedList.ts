export interface NodeLinkInfo<T> {
    id: string | null;
    nextId: string | undefined;
    prevId: string | undefined;
    data?: T;
}

const LIST_HEAD_NODE_ID = "**HEAD**";
const LIST_TAIL_NODE_ID = "**TAIL**";

export class LinkedList<T> {
    constructor() {
        this.nodeInfo = {};
    }
    protected nodeInfo: { [id: string]: NodeLinkInfo<T> };
    /**
     * Use addInitialLink to build the initial linked list, after that, use addItemBefore, addItemAfter or appendItem.
     * @param itemId
     * @param nextId
     */
    addInitialLink(itemId: string | null, nextId: string | null) {
        if (itemId === nextId) {
            throw new Error(`Unable to addInitialLink because itemId=${itemId} and nextId=${nextId} - they may not be the same`);
        }
        const itemIdOrHeadId = itemId || LIST_HEAD_NODE_ID;
        const nextIdOrTailId = nextId || LIST_TAIL_NODE_ID;
        let leftNode = this.nodeInfo[itemIdOrHeadId];
        if (!leftNode) {
            leftNode = {
                id: itemId,
                nextId,
                prevId: undefined
            };
            this.nodeInfo[itemIdOrHeadId] = leftNode;
        } else if (!leftNode.nextId) {
            leftNode.nextId = nextIdOrTailId;
        } else if (leftNode.nextId !== nextIdOrTailId) {
            throw new Error(`addInitialLink(${itemId},${nextId}) called when ${leftNode.nextId} <-- ${itemId} link exists`);
        }
        let rightNode = this.nodeInfo[nextIdOrTailId];
        if (!rightNode) {
            rightNode = {
                id: nextId,
                nextId: undefined,
                prevId: itemIdOrHeadId
            };
            this.nodeInfo[nextIdOrTailId] = rightNode;
        } else if (!rightNode.prevId) {
            rightNode.prevId = itemIdOrHeadId;
        } else if (rightNode.prevId !== itemIdOrHeadId) {
            throw new Error(`addInitialLink(${itemId},${nextId}) called when ${rightNode.prevId} --> ${nextId} already exists`);
        }
    }
    private addFistItemLinks(itemId: string) {
        if (!itemId) {
            throw new Error("handleFirstItemAddAndReturnLastNodeInfo(null|undefined) is not valid");
        }
        this.addInitialLink(null, itemId);
        this.addInitialLink(itemId, null);
    }
    appendItem(itemId: string | null, data: T) {
        if (!itemId) {
            throw new Error("appendItem(null|undefined) is not valid");
        }
        const itemNode = this.nodeInfo[itemId];
        if (itemNode) {
            throw new Error(`appendItem(${itemId}) may not be called when ID already present in list`);
        }
        let item = this.getLastItemNodeInfo();
        if (!item) {
            this.addFistItemLinks(itemId);
        } else {
            const lastItemId = item.id;
            item.nextId = itemId;
            this.nodeInfo[itemId] = {
                id: itemId,
                nextId: LIST_TAIL_NODE_ID,
                prevId: lastItemId
            };
            this.nodeInfo[LIST_TAIL_NODE_ID] = {
                id: null,
                nextId: undefined,
                prevId: itemId
            };
        }
        this.nodeInfo[itemId].data = data;
    }
    addItemAfter(
        itemId: string | null,
        afterItemId: string | null,
        data: T,
        options: {
            throwErrorForDups: boolean;
            requireItemIdExistance: boolean;
        } = {
            throwErrorForDups: true,
            requireItemIdExistance: true
        }
    ) {
        if (!itemId) {
            throw new Error("addItemAfter(null|undefined, ...) is not valid");
        }
        const afterItemNode = this.nodeInfo[afterItemId];
        const afterItemNodeExists = !!afterItemNode;
        if (options.requireItemIdExistance && !afterItemNodeExists) {
            throw new Error(`addItemAfter(${itemId}, ${afterItemId}, ...) may not be called when afterItemId not present in list`);
        }
        const itemNode = this.nodeInfo[itemId];
        const itemNodeExists = !!itemNode;
        if (options.throwErrorForDups && itemNodeExists) {
            throw new Error(`addItemAfter(${itemId}, ...) may not be called when ID already present in list`);
        }
        let lastItem = this.getLastItemNodeInfo();
        if (!lastItem) {
            // nothing exists yet, but if we past the check above for existence, this is allowed
            this.addFistItemLinks(itemId);
        } else if (afterItemNodeExists) {
            // afterItem --> item --> afterItemNext
            const afterItemNext = this.nodeInfo[afterItemNode.nextId];
            this.nodeInfo[itemId] = {
                id: itemId,
                nextId: afterItemNode.nextId,
                prevId: afterItemId
            };
            afterItemNode.nextId = itemId;
            afterItemNext.prevId = itemId;
        }
        if (afterItemNodeExists || !lastItem) {
            this.nodeInfo[itemId].data = data;
        }
    }
    addItemBefore(
        itemId: string | null,
        beforeItemId: string | null,
        data: T,
        options: {
            throwErrorForDups: boolean;
            requireItemIdExistance: boolean;
        } = {
            throwErrorForDups: true,
            requireItemIdExistance: true
        }
    ) {
        if (!itemId) {
            throw new Error("addItemBefore(null|undefined, ...) is not valid");
        }
        const beforeItemNode = this.nodeInfo[beforeItemId];
        const beforeItemNodeExists = !!beforeItemNode;
        if (options.requireItemIdExistance && !beforeItemNodeExists) {
            throw new Error(
                `addItemBefore(${itemId}, ${beforeItemId}, ...) may not be called when beforeItemId not present in list`
            );
        }
        const itemNode = this.nodeInfo[itemId];
        const itemNodeExists = !!itemNode;
        if (options.throwErrorForDups && itemNodeExists) {
            throw new Error(`addItemBefore(${itemId}, ...) may not be called when ID already present in list`);
        }
        let lastItem = this.getLastItemNodeInfo();
        if (!lastItem) {
            // nothing exists yet, but if we past the check above for existence, this is allowed
            this.addFistItemLinks(itemId);
        } else if (beforeItemNodeExists) {
            const beforeItemPrev = this.nodeInfo[beforeItemNode.prevId];
            this.nodeInfo[itemId] = {
                id: itemId,
                nextId: beforeItemId,
                prevId: beforeItemNode.prevId
            };
            beforeItemPrev.nextId = itemId;
            beforeItemNode.prevId = itemId;
        }
        if (beforeItemNodeExists || !lastItem) {
            this.nodeInfo[itemId].data = data;
        }
    }
    addItemData(id: string, data: T) {
        const node = this.nodeInfo[id];
        if (node) {
            node.data = data;
        }
    }
    addArray(idPropertyName: string, items: any[]) {
        this.addArray2(idPropertyName, idPropertyName, items);
    }
    addArray2(idPropertyName: string, id2PropertyName: string, items: any[]) {
        let itemId: string;
        items.forEach((item) => {
            itemId = item[idPropertyName] || this.buildId2Value(item[id2PropertyName]);
            if (typeof itemId !== "string") {
                throw new Error(`Item ID must be a string - item stringified: "${JSON.stringify(item)}"`);
            }
            this.appendItem(itemId, item);
        });
    }
    /**
     * Add an array of items and link them to the end of the existing items.
     *
     * @param idPropertyName the name of the ID property (usually just "id")
     * @param items an array of items to add in sequence
     */
    buildId2Value(id2PropertyRawValue: any) {
        if (id2PropertyRawValue) {
            return `id2-${id2PropertyRawValue}`;
        }
        return id2PropertyRawValue;
    }
    getItemNodeInfo(itemId: string): NodeLinkInfo<T> {
        if (!itemId) {
            throw new Error(
                "Unable to retrieve by itemId null because that could mean HEAD or TAIL of linked list- use specific ID"
            );
        }
        const node = this.nodeInfo[itemId];
        if (node) {
            return node;
        }
        return null;
    }
    getFirstItemNodeInfo(): NodeLinkInfo<T> {
        const head = this.nodeInfo[LIST_HEAD_NODE_ID];
        if (head) {
            let item = this.nodeInfo[head.nextId];
            return item;
        }
        return null;
    }
    getLastItemNodeInfo(): NodeLinkInfo<T> {
        const tail = this.nodeInfo[LIST_TAIL_NODE_ID];
        if (tail) {
            let item = this.nodeInfo[tail.prevId];
            return item;
        }
        return null;
    }
    checkDataIntegrity() {
        const nodesExist = Object.keys(this.nodeInfo).length > 0;
        if (!nodesExist) {
            // nothing added yet, that's a valid state
            return;
        }
        const firstItem = this.getFirstItemNodeInfo();
        if (!firstItem) {
            throw new Error("checkDataIntegrity failed because nodes exist, but firstItem is falsy");
        }
        const lastItem = this.getLastItemNodeInfo();
        if (!lastItem) {
            throw new Error("checkDataIntegrity failed because nodes exist, but lastItem is falsy");
        }
    }
    toArray(): T[] {
        this.checkDataIntegrity();
        const items = [];
        let item = this.getFirstItemNodeInfo();
        let lastItem = this.getLastItemNodeInfo();
        let busy = !!item;
        while (busy) {
            items.push(item.data);
            if (item.id === lastItem.id) {
                busy = false;
            } else {
                item = this.nodeInfo[item.nextId];
                busy = !!item;
            }
        }
        return items;
    }
    toIdArray(): string[] {
        this.checkDataIntegrity();
        const items = [];
        let item = this.getFirstItemNodeInfo();
        let lastItem = this.getLastItemNodeInfo();
        let busy = !!item;
        while (busy) {
            items.push(item.id);
            if (item.id === lastItem.id) {
                busy = false;
            } else {
                item = this.nodeInfo[item.nextId];
                busy = !!item;
            }
        }
        return items;
    }
    isFirstItem(itemId: string) {
        if (!itemId) {
            return false;
        }
        const firstItem = this.getFirstItemNodeInfo();
        return firstItem?.id === itemId;
    }
    isLastItem(itemId: string) {
        if (!itemId) {
            return false;
        }
        const lastItem = this.getLastItemNodeInfo();
        return lastItem?.id === itemId;
    }
}
