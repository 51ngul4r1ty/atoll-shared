// test related
import "jest";

// code under test
import { LinkedList } from "../linkedList";

describe("Linked List", () => {
    describe("toArray", () => {
        it("should handle empty list correctly", () => {
            const list = new LinkedList();
            const result = list.toArray();
            expect(result.length).toEqual(0);
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
