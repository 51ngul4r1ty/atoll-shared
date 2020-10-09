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
    private fourDigitLinkId(id: string): string {
        if (!id) {
            return `null`;
        } else {
            return id.substr(id.length - 4);
        }
    }
    getDiagnosticString(): string {
        return `main: ${this.getMainLinkDiagString()};\norphans: ${this.getOrphanDiagString()}\n`;
    }
    getOrphanLinkedListItemStart(orphanItem: LinkedListItem<T>): LinkedListItem<T> {
        let curr = orphanItem;
        while (curr.prev !== null) {
            curr = curr.prev;
        }
        return curr;
    }
    getOrphanDiagString(): string {
        let curr = this.firstItem;
        let result = "";
        let linkedInItems: { [key: string]: LinkedListItem<T> } = {};
        while (curr) {
            linkedInItems[curr.id] = curr;
            curr = curr.next;
        }
        let allItemKeys = Object.keys(this.itemHashMap);
        let orphanDiagStrings: { [key: string]: LinkedListItem<T> } = {};
        let orphanIds: string[] = [];
        allItemKeys.forEach((key) => {
            if (!linkedInItems[key]) {
                const orphanItem = this.itemHashMap[key];
                orphanIds.push(orphanItem.id);
                const firstItemInOrphanLinkChain = this.getOrphanLinkedListItemStart(orphanItem);
                const orphanDiagString = this.getLinkDiagString(firstItemInOrphanLinkChain);
                orphanDiagStrings[orphanDiagString] = orphanItem;
            }
        });
        const orphanDiagStringKeys = Object.keys(orphanDiagStrings);
        orphanDiagStringKeys.forEach((key) => {
            if (result) {
                result += "; ";
            }
            result += key;
        });
        return result;
        //        return `none`;
    }
    getLinkDiagString(item: LinkedListItem<T>, itemToHighlight?: LinkedListItem<T>): string {
        let curr = item;
        let lastCurr: LinkedListItem<T> = null;
        let result = "";
        while (curr) {
            if (this.isFirstItem(curr.id)) {
                result += " [ ";
            }
            const hightlightThisItem = itemToHighlight?.id === curr.id;
            if (hightlightThisItem) {
                result += "▸ ";
            }
            result += this.fourDigitLinkId(curr.id);
            if (hightlightThisItem) {
                result += "◂ ";
            }
            if (this.isLastItem(curr.id)) {
                result += " ] ";
            }
            if (curr.next) {
                const linkToLastCurrId = curr.prev?.id || null;
                const lastCurrId = lastCurr?.id || null;
                const linkBackGood = linkToLastCurrId === lastCurrId;
                const linkBackBad = !linkBackGood && linkToLastCurrId !== null;
                if (linkBackGood) {
                    result += " <--> ";
                } else if (linkBackBad) {
                    result += " *--> ";
                } else {
                    result += " ---> ";
                }
            }
            lastCurr = curr;
            curr = curr.next;
        }
        return result;
    }
    getMainLinkDiagString(): string {
        return this.getLinkDiagString(this.firstItem);
    }
    private addFirstItem(itemId: string) {
        if (this.firstItem || this.lastItem) {
            throw new Error(`Unable to add first item because firstItem=${this.firstItem} and lastItem=${this.lastItem}`);
        }
        const item = this.addUnlinkedItem(itemId);
        item.next = null;
        item.prev = null;
        this.firstItem = item;
        this.lastItem = item;
    }
    /**
     * Insert a shell item (with ID `{itemId}`) before the item with ID `{beforeId}`.
     *
     * @param itemId must not be null and item with this ID must NOT exist
     * @param beforeId must not be null and item with this ID must exist
     */
    addIdBefore(
        itemId: string,
        beforeId: string | null,
        calledFromAddIdAfter: boolean = false,
        supportOrphanedItems: boolean = false
    ) {
        if (itemId && !beforeId) {
            if (this.lastItem) {
                if (this.lastItem?.id === itemId) {
                    throw new Error(`Unable to add an item with the same ID ${itemId} to the end of the list more than once`);
                } else {
                    if (calledFromAddIdAfter) {
                        throw new Error(`Unable to call addIdAfter because addIdBefore already called addIdAfter once!`);
                    }
                    this.addIdAfter(itemId, this.lastItem.id, true);
                }
            } else {
                this.addFirstItem(itemId);
            }
            return;
        }

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
                } else if (!supportOrphanedItems) {
                    // it is possible we're inserting an item before an orphaned item in this case, so we only throw this error
                    // when running with "stricter" default rules
                    try {
                        console.log(`DIAGNOSTIC STRING: ${this.getDiagnosticString()}`);
                    } catch (err) {
                        console.log(`DIAGNOSTIC STRING: Error = ${err}`);
                    }
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
    addIdAfter(itemId: string, afterId: string | null, calledFromAddIdBefore: boolean = false) {
        if (itemId && !afterId) {
            if (this.firstItem) {
                if (this.firstItem?.id === itemId) {
                    throw new Error(`Unable to add an item with the same ID ${itemId} to the start of the list more than once`);
                } else {
                    // addIdBefore can handle this instead
                    if (calledFromAddIdBefore) {
                        throw new Error(`Unable to call addIdBefore because addIdAfter already called addIdBefore once!`);
                    }
                    this.addIdBefore(itemId, this.firstItem.id, true);
                }
            } else {
                this.addFirstItem(itemId);
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
        let item = this.itemHashMap[itemId] || null;
        let next = this.itemHashMap[nextId] || null;
        if (itemId && !item && nextId && next) {
            // if both itemId & nextId were both passed in but only next item existed already, that means we need to insert the link
            // before that "next" item.
            this.addIdBefore(itemId, nextId, false, true);
        } else if (itemId && item && nextId && !next) {
            this.addIdAfter(nextId, itemId);
        } else if (itemId && !item && !nextId) {
            // add this item at the end of the list
            this.addIdAfter(itemId, this.lastItem?.id || null);
        } else if (!itemId && nextId && !next) {
            // add this item at the beginning of the list
            this.addIdBefore(nextId, this.firstItem?.id || null);
        } else {
            let nextAdded = false;
            let itemAdded = false;

            if (!next && nextId !== null) {
                // need to add the "next" item because it doesn't exist yet
                next = this.addUnlinkedItem(nextId);
                nextAdded = true;
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
                    }
                }
                if (next?.id && next?.id === this.firstItem?.id) {
                    // next is first item but we just added something before it!
                    if (itemAdded) {
                        this.firstItem = item;
                    } else {
                        // if it existed we'll need to do a bit more work to find where the list starts
                        const startItem = this.getOrphanLinkedListItemStart(item);
                        this.firstItem = startItem;
                    }
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
                this.firstItem = itemId ? item : next;
            }
            if (!this.lastItem) {
                this.lastItem = nextId ? next : item;
            }
        }
        console.log(`DEBUG STRING: addLink(${itemId}, ${nextId}) ${this.getDiagnosticString()}`);
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
    toIdArray(): string[] {
        const items = [];
        let item = this.firstItem;
        while (item) {
            items.push(item.id);
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
