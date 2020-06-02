export class LinkedListItem<T> {
    id: string;
    next: LinkedListItem<T> | null;
    data: T;
}

export interface ItemHashMap<T> {
    [id: string]: LinkedListItem<T>;
}

export class LinkedList<T> {
    constructor() {
        this.firstItem = null;
        this.itemHashMap = {};
    }
    private firstItem: LinkedListItem<T>;
    private itemHashMap: ItemHashMap<T>;
    private addUnlinkedItem(id: string) {
        const newItem = new LinkedListItem<T>();
        newItem.id = id;
        newItem.next = null;
        this.itemHashMap[id] = newItem;
        return newItem;
    }
    /**
     * Add a link to the linked list,
     * e.g. Representing the linked list using pairs: (*item*, next) where "item" is essentially the ID of the item and
     *      "next" is just a link to the next item in the list:
     *      If you have
     *        (*a*, b) -> (*b*, c) -> (*c*, d) --> (*d*, null)
     *      and you want to insert item "x" between *b* and *c*:
     *        itemId = x, nextId = c
     * @param {string} itemId if null, the "next" item will be linked to the start of the list
     * @param {string} nextId ID of item that follows the item with ID itemId
     */
    addLink(itemId: string, nextId: string) {
        if (itemId === nextId) {
            throw new Error(`Unable to addLink because itemId=${itemId} and nextId=${nextId} - they may not be the same`);
        }
        let item = this.itemHashMap[itemId] || null; // 1. item = "1"
        let next = this.itemHashMap[nextId] || null; // 2. next = null
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
            const oldNext = item.next;
            item.next = next;
            if (next && nextAdded) {
                // make sure to preserve the link to the next item in the chain
                next.next = oldNext;
            }
            if (itemAdded && next?.id && next?.id === this.firstItem?.id) {
                // next is first item but we just added something before it!
                this.firstItem = item;
            }
            if (itemAdded && !item.next) {
                // item being added to end of list
                const lastItem = this.getLastItem();
                if (lastItem && lastItem?.id !== item.id) {
                    // link last item to this item avoiding circular reference
                    lastItem.next = item;
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
        } else if (!this.firstItem) {
            // if no item has been added as the first item then this item is it until another one is assigned
            this.firstItem = item;
        }
    }
    addItemData(id: string, data: T) {
        const item = this.itemHashMap[id];
        if (item) {
            item.data = data;
        }
    }
    getLastItem() {
        let item = this.firstItem;
        let lastItem: LinkedListItem<T> | null = null;
        while (item) {
            lastItem = item;
            item = item.next;
        }
        return lastItem;
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
    addArray2(idPropertyName: string, id2PropertyName: string, items: any[]) {
        const maxitems = 10;
        let prevId: string;
        let itemId: string;

        const lastItem = this.getLastItem();
        if (lastItem) {
            prevId = lastItem.id;
        }

        /* 1. add links */
        items.forEach((item) => {
            itemId = item[idPropertyName] || `${item[id2PropertyName]}`;
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
            this.addItemData(item[idPropertyName] || `${item[id2PropertyName]}`, item);
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
