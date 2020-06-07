// test related
import "jest";

// code under test
import { LinkedList } from "../linkedList";

describe("Linked List", () => {
    describe("addLink", () => {
        // scenario 1: itemId set, item missing, nextId set, next present
        it("should set first/lastItem correctly when linking to existing 'next' item", () => {
            const list = new LinkedList();
            list.addLink("item-d", null);
            list.addLink("item-c", "item-d");
            expect(list.isFirstItem("item-c")).toBeTruthy();
            expect(list.isLastItem("item-d")).toBeTruthy();
        });
        // scenario 2: itemId set, item present, nextId set, next missing
        it("should set first/lastItem correctly when linking to existing 'prev' item", () => {
            const list = new LinkedList();
            list.addLink("item-c", null);
            list.addLink("item-c", "item-d");
            expect(list.isFirstItem("item-c")).toBeTruthy();
            expect(list.isLastItem("item-d")).toBeTruthy();
        });
        // scenario 3: itemId set, item missing
        it("should set first/lastItem correctly when adding a single item to end of list", () => {
            const list = new LinkedList();
            list.addLink("item1", null);
            expect(list.isFirstItem("item1")).toBeTruthy();
            expect(list.isLastItem("item1")).toBeTruthy();
        });
        // scenario 4: nextId set, next missing
        it("should set first/lastItem correctly when adding a single item to beginning of list", () => {
            const list = new LinkedList();
            list.addLink(null, "item1-b");
            expect(list.isFirstItem("item1-b")).toBeTruthy();
            expect(list.isLastItem("item1-b")).toBeTruthy();
        });
        // scenario 5: everything set and present
        it("should handle setting up the same link twice", () => {
            const list = new LinkedList();
            list.addLink("item1-a", "item1-b");
            list.addLink("item1-a", "item1-b");
            expect(list.isFirstItem("item1-a")).toBeTruthy();
            expect(list.isLastItem("item1-b")).toBeTruthy();
        });
        // scenario 6: itemId set, item present
        it("should handle setting up the same item twice", () => {
            const list = new LinkedList();
            list.addLink(null, "item-a");
            list.addLink("item-a", null);
            expect(list.isFirstItem("item-a")).toBeTruthy();
            expect(list.isLastItem("item-a")).toBeTruthy();
        });
        // scenario 7: nextId set, next present
        it("should handle setting up the same 'next' twice", () => {
            const list = new LinkedList();
            list.addLink(null, "item-a");
            list.addLink(null, "item-a");
            expect(list.isFirstItem("item-a")).toBeTruthy();
            expect(list.isLastItem("item-a")).toBeTruthy();
        });
        // scenario 8: itemId set, nextId set, nothing present
        it("should handle two items in link with neither store in collection yet", () => {
            const list = new LinkedList();
            list.addLink("item-x", "item-y");
            expect(list.isFirstItem("item-x")).toBeTruthy();
            expect(list.isLastItem("item-y")).toBeTruthy();
        });
        // scenario 9: itemId and nextId both not set
        it("should throw error when two items in link are null", () => {
            const list = new LinkedList();
            const t = () => list.addLink(null, null);
            expect(t).toThrow(Error);
        });
    });
    describe("toArray", () => {
        it("should handle empty list correctly", () => {
            const list = new LinkedList();
            const result = list.toArray();
            expect(result.length).toEqual(0);
        });
        it("should handle link without data", () => {
            const list = new LinkedList();
            list.addLink("item1", "item2");
            list.addItemData("item1", { someObjField: "nothing important" });
            const result = list.toArray();
            expect(result).toStrictEqual([{ someObjField: "nothing important" }]);
        });
    });
    describe("addArray", () => {
        it("should handle empty array correctly", () => {
            const list = new LinkedList();
            list.addArray("id", []);
            const result = list.toArray();
            expect(result.length).toEqual(0);
        });
        it("should handle single item correctly", () => {
            const list = new LinkedList();
            const items = [
                {
                    id: "1",
                    value: "item 1"
                }
            ];
            list.addArray("id", items);
            const result = list.toArray();
            expect(result.length).toEqual(1);
            expect(result[0]).toStrictEqual({
                id: "1",
                value: "item 1"
            });
        });
        it("should handle multiple item list correctly", () => {
            const list = new LinkedList();
            const items = [
                {
                    id: "1",
                    value: "item 1"
                },
                {
                    id: "2",
                    value: "item 2"
                },
                {
                    id: "3",
                    value: "item 3"
                }
            ];
            list.addArray("id", items);
            const result = list.toArray();
            expect(result.length).toEqual(3);
            expect(result[0]).toStrictEqual({
                id: "1",
                value: "item 1"
            });
            expect(result[1]).toStrictEqual({
                id: "2",
                value: "item 2"
            });
            expect(result[2]).toStrictEqual({
                id: "3",
                value: "item 3"
            });
        });
        it("should handle addArray called more than once correctly", () => {
            const list = new LinkedList();
            const itemsA = [
                {
                    id: "A1",
                    value: "item A1"
                }
            ];
            const itemsB = [
                {
                    id: "1",
                    value: "item 1"
                },
                {
                    id: "2",
                    value: "item 2"
                },
                {
                    id: "3",
                    value: "item 3"
                }
            ];
            list.addArray("id", itemsA);
            list.addArray("id", itemsB);
            const result = list.toArray();
            expect(result.length).toEqual(4);
            expect(result[0]).toStrictEqual({
                id: "A1",
                value: "item A1"
            });
            expect(result[1]).toStrictEqual({
                id: "1",
                value: "item 1"
            });
            expect(result[2]).toStrictEqual({
                id: "2",
                value: "item 2"
            });
            expect(result[3]).toStrictEqual({
                id: "3",
                value: "item 3"
            });
        });
        it("addArray should update firstItem & lastItem correctly", () => {
            const list = new LinkedList();
            const firstItemId = "1";
            const middleItemId = "2";
            const lastItemId = "3";
            const items = [
                {
                    id: firstItemId,
                    value: "item 1"
                },
                {
                    id: middleItemId,
                    value: "item 2"
                },
                {
                    id: lastItemId,
                    value: "item 3"
                }
            ];
            list.addArray("id", items);
            expect(list.isFirstItem(firstItemId)).toBeTruthy();
            expect(list.isLastItem(lastItemId)).toBeTruthy();
        });
    });
    describe("combinations", () => {
        it("should handle addArray followed by addLink (to start of list, prev=null)", () => {
            const list = new LinkedList();
            const items = [
                {
                    id: "1",
                    value: "item 1"
                },
                {
                    id: "2",
                    value: "item 2"
                },
                {
                    id: "3",
                    value: "item 3"
                }
            ];
            list.addArray("id", items);

            const newId = "new-item-1";
            list.addLink(null, newId);
            list.addItemData(newId, { id: newId, value: "new item 1" });

            const result = list.toArray();
            expect(result.length).toEqual(4);
            expect(result[0]).toStrictEqual({
                id: "new-item-1",
                value: "new item 1"
            });
            expect(result[1]).toStrictEqual({
                id: "1",
                value: "item 1"
            });
            expect(result[2]).toStrictEqual({
                id: "2",
                value: "item 2"
            });
            expect(result[3]).toStrictEqual({
                id: "3",
                value: "item 3"
            });
        });
        it("should handle addArray followed by addLink (before first item, next=first)", () => {
            const list = new LinkedList();
            const firstItemId = "1";
            const items = [
                {
                    id: firstItemId,
                    value: "item 1"
                },
                {
                    id: "2",
                    value: "item 2"
                },
                {
                    id: "3",
                    value: "item 3"
                }
            ];
            list.addArray("id", items);

            const newId = "new-item-1";
            list.addLink(newId, firstItemId);
            list.addItemData(newId, { id: newId, value: "new item 1" });

            const result = list.toArray();
            expect(result.length).toEqual(4);
            expect(result[0]).toStrictEqual({
                id: "new-item-1",
                value: "new item 1"
            });
            expect(result[1]).toStrictEqual({
                id: "1",
                value: "item 1"
            });
            expect(result[2]).toStrictEqual({
                id: "2",
                value: "item 2"
            });
            expect(result[3]).toStrictEqual({
                id: "3",
                value: "item 3"
            });
        });
        it("should handle addArray followed by addLink (after first item, next=first)", () => {
            const list = new LinkedList();
            const firstItemId = "1";
            const items = [
                {
                    id: firstItemId,
                    value: "item 1"
                },
                {
                    id: "2",
                    value: "item 2"
                },
                {
                    id: "3",
                    value: "item 3"
                }
            ];
            list.addArray("id", items);

            const newId = "new-item-1";
            list.addLink(firstItemId, newId);
            list.addItemData(newId, { id: newId, value: "new item 1" });

            const result = list.toArray();
            expect(result.length).toEqual(4);
            expect(result[0]).toStrictEqual({
                id: "1",
                value: "item 1"
            });
            expect(result[1]).toStrictEqual({
                id: "new-item-1",
                value: "new item 1"
            });
            expect(result[2]).toStrictEqual({
                id: "2",
                value: "item 2"
            });
            expect(result[3]).toStrictEqual({
                id: "3",
                value: "item 3"
            });
        });
        it("should handle addArray followed by addLink (to end of list, next=null)", () => {
            const list = new LinkedList();
            const firstItemId = "1";
            const items = [
                {
                    id: firstItemId,
                    value: "item 1"
                },
                {
                    id: "2",
                    value: "item 2"
                },
                {
                    id: "3",
                    value: "item 3"
                }
            ];
            list.addArray("id", items);

            const newId = "new-item-1";
            list.addLink(newId, null);
            list.addItemData(newId, { id: newId, value: "new item 1" });

            const result = list.toArray();
            expect(result.length).toEqual(4);
            expect(result[0]).toStrictEqual({
                id: "1",
                value: "item 1"
            });
            expect(result[1]).toStrictEqual({
                id: "2",
                value: "item 2"
            });
            expect(result[2]).toStrictEqual({
                id: "3",
                value: "item 3"
            });
            expect(result[3]).toStrictEqual({
                id: "new-item-1",
                value: "new item 1"
            });
        });
    });
});
