export class LinkedListItem<T> {
    id: string;
    next: LinkedListItem<T> | null;
    prev: LinkedListItem<T> | null;
    data: T;
}

export interface ItemHashMap<T> {
    [id: string]: LinkedListItem<T>;
}

export class LinkedList<T> {
    constructor() {
        this.firstItem = null;
        this.lastItem = null;
        this.itemHashMap = {};
    }
    private firstItem: LinkedListItem<T>;
    private lastItem: LinkedListItem<T>;
    private itemHashMap: ItemHashMap<T>;
    private addUnlinkedItem(id: string) {
        const newItem = new LinkedListItem<T>();
        newItem.id = id;
        newItem.next = null;
        newItem.prev = null;
        this.itemHashMap[id] = newItem;
        return newItem;
    }
    isFirstItem(itemId: string) {
        if (!itemId) {
            return false;
        }
        return this.firstItem?.id === itemId;
    }
    isLastItem(itemId: string) {
        if (!itemId) {
            return false;
        }
        return this.lastItem?.id === itemId;
    }
    /**
     * Insert a shell item (with ID `{itemId}`) before the item with ID `{beforeId}`.
     *
     * @param itemId must not be null and item with this ID must NOT exist
     * @param beforeId must not be null and item with this ID must exist
     */
    addIdBefore(itemId: string, beforeId: string) {
        if (!itemId || !beforeId) {
            throw new Error(`Unable to addIdBefore because itemId=${itemId} and beforeId=${beforeId} - they may not be the null`);
        }
        if (itemId === beforeId) {
            throw new Error(`Unable to addIdBefore because itemId=${itemId} and beforeId=${beforeId} - they may not be the same`);
        }
        let next = this.itemHashMap[beforeId] || null;
        if (!next) {
            throw new Error(`Unable to addIdBefore because itemId=${itemId} and beforeId=${beforeId} - before entry doesn't exist`);
        }
        let oldNextPrev = next.prev;
        let item = this.itemHashMap[itemId] || null;
        if (item) {
            // if item already exists then we only allow scenario where it isn't linked to anything or the link isn't changing
            if (item.prev) {
                throw new Error(`Unable to addIdBefore because itemId=${itemId} already exists and has the "prev" property set`);
            } else if (this.isFirstItem(item.id)) {
                if (!item.next) {
                    throw new Error(`Possible orphan items encountered - itemId=${itemId} and beforeId=${beforeId} both unlinked?`);
                } else if (item.next.id !== beforeId) {
                    throw new Error(
                        `addIdBefore cannot move an item - item.next.id=${item.next.id} should match beforeId=${beforeId}`
                    );
                }
            } else {
                // item isn't first item, but item.prev is unassigned
                throw new Error(`Possible orphan item encountered - itemId=${itemId} is not firstItem but item.prev is unassigned`);
            }
        } else {
            item = this.addUnlinkedItem(itemId);
            item.next = next;
            if (oldNextPrev) {
                // BEFORE: oldNextPrev <------------> next
                // AFTER:  oldNextPrev <--> item <--> next
                item.prev = oldNextPrev;
                oldNextPrev.next = item;
            } else {
                // BEFORE: null <-------------------------> next (=firstItem)
                // AFTER:  null <--> item (=firstItem) <--> next
                item.prev = null;
                if (!this.firstItem) {
                    this.firstItem = item;
                    if (!this.lastItem) {
                        throw new Error(`Unable to addIdBefore because firstItem is defined but lastItem is not!`);
                    } else {
                        this.lastItem = item;
                    }
                } else if (this.firstItem.id === next.id) {
                    this.firstItem = item;
                } else {
                    throw new Error(
                        `Unable to addIdBefore because inserting before item (${beforeId}) that should be the first` +
                            ` item in the linked list, but is not (${this.firstItem.id} is).`
                    );
                }
            }
        }
    }
    /**
     * Insert a shell item (with ID `{itemId}`) after the item with ID `{afterId}`.
     *
     * @param itemId must not be null and item with this ID must NOT exist
     * @param afterId must not be null and item with this ID must exist
     */
    addIdAfter(itemId: string, afterId: string | null) {
        if (itemId && !afterId) {
            if (this.firstItem) {
                if (this.firstItem?.id === itemId) {
                    throw new Error(`Unable to add an item with the same ID ${itemId} to the start of the list more than once`);
                } else {
                    // addIdBefore can handle this instead
                    this.addIdBefore(itemId, this.firstItem.id);
                }
            } else {
                const item = this.addUnlinkedItem(itemId);
                item.next = null;
                item.prev = null;
                this.firstItem = item;
                this.lastItem = item;
            }
            return;
        }
        if (!itemId) {
            throw new Error(`Unable to addIdAfter because itemId=${itemId} may not be the null`);
        }
        if (itemId === afterId) {
            throw new Error(`Unable to addIdAfter because itemId=${itemId} and afterId=${afterId} - they may not be the same`);
        }
        let prev = this.itemHashMap[afterId] || null;
        if (!prev) {
            throw new Error(`Unable to addIdAfter because itemId=${itemId} and afterId=${afterId} - after entry doesn't exist`);
        }
        let oldPrevNext = prev.next || null;
        let item = this.itemHashMap[itemId] || null;
        if (item) {
            // if item already exists then we only allow scenario where it isn't linked to anything or the link isn't changing
            if (item.next) {
                throw new Error(`Unable to addIdAfter because itemId=${itemId} already exists and has the "next" property set`);
            } else if (this.isLastItem(item.id)) {
                if (!item.prev) {
                    throw new Error(`Possible orphan items encountered - itemId=${itemId} and afterId=${afterId} both unlinked?`);
                } else if (item.prev.id !== afterId) {
                    throw new Error(
                        `addIdAfter cannot move an item - item.prev.id=${item.prev.id} should match afterId=${afterId}`
                    );
                }
            } else {
                // item isn't first item, but item.prev is unassigned
                throw new Error(`Possible orphan item encountered - itemId=${itemId} is not firstItem but item.prev is unassigned`);
            }
        } else {
            item = this.addUnlinkedItem(itemId);
            item.prev = prev;
            prev.next = item;
            item.next = oldPrevNext; // handles if it was null before
            if (!oldPrevNext) {
                // BEFORE: prev (=lastItem) <-------------> null (=oldPrevNext)
                // AFTER:  prev <--> item (=lastItem) <--> null
                if (!this.lastItem) {
                    this.lastItem = item;
                } else if (this.isLastItem(prev.id)) {
                    this.lastItem = item;
                } else {
                    throw new Error(
                        `Unable to addIdAfter because inserting after item (${afterId}) that should be the last` +
                            ` item in the linked list, but is not (${this.lastItem.id} is).`
                    );
                }
            } else {
                // BEFORE: prev <------------> oldPrevNext
                // AFTER:  prev <--> item <--> oldPrevNext
            }
        }
    }
    /**
     * Add a link to the linked list,
     * e.g. Representing the linked list using pairs: (*item*, next) where "item" is essentially the ID of the item and
     *      "next" is just a link to the next item in the list:
     *      If you have
     *        (*a*, b) -> (*b*, c) -> (*c*, d) --> (*d*, null)
     *      and you want to insert item "x" between *b* and *c*:
     *        itemId = x, nextId = c
     * @param itemId if null, the "next" item will be linked to the start of the list
     * @param nextId ID of item that follows the item with ID itemId
     */
    addLink(itemId: string | null, nextId: string | null) {
        if (itemId === nextId) {
            throw new Error(`Unable to addLink because itemId=${itemId} and nextId=${nextId} - they may not be the same`);
        }
        let item = this.itemHashMap[itemId] || null; // 1. item = "1"
        let next = this.itemHashMap[nextId] || null; // 2. next = null
        if (itemId && !item && nextId && next) {
            // if both itemId & nextId were both passed in but only next item existed already, that means we need to insert the link
            // before that "next" item.
            this.addIdBefore(itemId, nextId);
        } else if (itemId && item && nextId && !next) {
            this.addIdAfter(nextId, itemId);
        } else if (itemId && !item && !nextId) {
            // add this item at the end of the list
            this.addIdAfter(itemId, this.lastItem?.id || null);
        } else if (!itemId && nextId && !next) {
            // add this item at the beginning of the list
            this.addIdBefore(nextId, this.firstItem.id);
        } else {
            let conditionNumber: number;
            if (itemId && item && nextId && next) {
                conditionNumber = 5;
            } else if (itemId && item && !nextId) {
                conditionNumber = 6;
            } else if (!itemId && nextId && next) {
                conditionNumber = 7;
            } else if (itemId && !item && nextId && !next) {
                conditionNumber = 8;
            }
            console.log(`exercising conditon #${conditionNumber}`);
            // scenarios this code handles: (1) "item" and "next" both aren't in list yet (2) TBD
            let nextAdded = false; // 3.
            let itemAdded = false; // 4.
            if (!next && nextId !== null) {
                // need to add the "next" item because it doesn't exist yet
                next = this.addUnlinkedItem(nextId); // 5. added (next = "new-item-1")
                nextAdded = true; // 6. nextAdded = true
            }
            if (!item && itemId !== null) {
                // need to add the item itself because it doesn't exist yet
                item = this.addUnlinkedItem(itemId);
                itemAdded = true;
            }
            if (item) {
                // link item to the next item
                const oldItemNext = item.next;
                item.next = next;
                if (next) {
                    if (nextAdded) {
                        // make sure to preserve the link to the next item in the chain
                        next.next = oldItemNext;
                        next.prev = item;
                        if (!this.lastItem) {
                            this.lastItem = next;
                        }
                        if (this.lastItem?.id === itemId) {
                            // we just added an item after the last item, need to update it!
                            this.lastItem = next;
                        }
                    } else {
                        // next was alrady there
                        // TODO: Handle this- write unit test for this scenario + add more logic here
                        const oldNextPrev = next.prev;
                    }
                }
                if (itemAdded && next?.id && next?.id === this.firstItem?.id) {
                    // next is first item but we just added something before it!
                    this.firstItem = item;
                }
                if (itemAdded && !item.next) {
                    // item being added to end of list
                    const lastItem = this.lastItem;
                    if (lastItem && lastItem?.id !== item.id) {
                        // link last item to this item avoiding circular reference
                        lastItem.next = item;
                        item.prev = lastItem;
                        this.lastItem = item;
                    }
                }
            }
            if (!itemId) {
                // if itemId isn't defined the caller is inserting the first item in the list
                const oldFirstItem = this.firstItem;
                // prevent a circular reference
                if (oldFirstItem?.id !== nextId) {
                    this.firstItem = next;
                    if (nextAdded) {
                        this.firstItem.next = oldFirstItem;
                    }
                }
            }
            // make sure first entries set firstItem & lastItem correctly
            if (!this.firstItem) {
                if (itemId) {
                    this.firstItem = item;
                } else {
                    this.firstItem = next;
                }
            }
            if (!this.lastItem) {
                if (nextId) {
                    this.lastItem = next;
                } else {
                    this.lastItem = item;
                }
            }
        }
    }
    addItemData(id: string, data: T) {
        const item = this.itemHashMap[id];
        if (item) {
            item.data = data;
        }
    }
    /**
     * Add an array of items and link them to the end of the existing items.
     *
     * @param idPropertyName the name of the ID property (usually just "id")
     * @param items an array of items to add in sequence
     */
    addArray(idPropertyName: string, items: any[]) {
        this.addArray2(idPropertyName, idPropertyName, items);
    }
    buildId2Value(id2PropertyRawValue: any) {
        if (id2PropertyRawValue) {
            return `id2-${id2PropertyRawValue}`;
        }
        return id2PropertyRawValue;
    }
    addArray2(idPropertyName: string, id2PropertyName: string, items: any[]) {
        const maxitems = 10;
        let prevId: string;
        let itemId: string;

        const lastItem = this.lastItem;
        if (lastItem) {
            prevId = lastItem.id;
        }

        /* 1. add links */
        items.forEach((item) => {
            itemId = item[idPropertyName] || this.buildId2Value(item[id2PropertyName]);
            if (typeof itemId !== "string") {
                throw new Error(`Item ID must be a string - item stringified: "${JSON.stringify(item)}"`);
            }
            if (prevId) {
                this.addLink(prevId, itemId);
            }
            prevId = itemId;
        });
        if (prevId) {
            this.addLink(prevId, null);
        }
        /* 2. add data */
        items.forEach((item) => {
            this.addItemData(item[idPropertyName] || this.buildId2Value(item[id2PropertyName]), item);
        });
    }
    toArray(): T[] {
        const items = [];
        let item = this.firstItem;
        while (item) {
            if (item.data) {
                items.push(item.data);
            }
            item = item.next;
        }
        return items;
    }
    getStatusText() {
        let result = "";
        let count = 0;
        const items = [];
        let item = this.firstItem;
        while (item) {
            count++;
            if (result) {
                result += ",";
            }
            result += `${count}`;
            item = item.next;
        }
        return result;
    }
}
