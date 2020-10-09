// test related
import "jest";

// code under test
import { LinkedList } from "../linkedList";

describe("Linked List", () => {
    describe("addInitialLink", () => {
        // scenario 1: itemId set, item missing, nextId set, next present
        it("should set first/lastItem correctly when linking to existing 'next' item", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item-c");
            list.addInitialLink("item-d", null);
            list.addInitialLink("item-c", "item-d");
            expect(list.isFirstItem("item-c")).toBeTruthy();
            expect(list.isLastItem("item-d")).toBeTruthy();
        });
        // scenario 2: itemId set, item present, nextId set, next missing
        it("should set first/lastItem correctly when linking to existing 'prev' item", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item-c");
            list.addInitialLink("item-c", "item-d");
            list.addInitialLink("item-d", null);
            expect(list.isFirstItem("item-c")).toBeTruthy();
            expect(list.isLastItem("item-d")).toBeTruthy();
        });
        // scenario 4: nextId set, next missing
        it("should set first/lastItem correctly when adding a single item to beginning of list", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item1-b");
            list.addInitialLink("item1-b", null);
            expect(list.isFirstItem("item1-b")).toBeTruthy();
            expect(list.isLastItem("item1-b")).toBeTruthy();
        });
        // scenario 5: everything set and present
        it("should handle setting up the same link twice", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item1-a");
            list.addInitialLink("item1-a", "item1-b");
            list.addInitialLink("item1-a", "item1-b");
            list.addInitialLink("item1-b", null);
            expect(list.isFirstItem("item1-a")).toBeTruthy();
            expect(list.isLastItem("item1-b")).toBeTruthy();
        });
        // scenario 7: nextId set, next present
        it("should not throw an error setting up the same 'next' twice", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item-a");
            list.addInitialLink("item-a", null);
            list.addInitialLink(null, "item-a");
            expect(list.isFirstItem("item-a")).toBeTruthy();
            expect(list.isLastItem("item-a")).toBeTruthy();
        });
        // scenario 9: itemId and nextId both not set
        it("should throw error when two items in link are null", () => {
            const list = new LinkedList();
            const t = () => list.addInitialLink(null, null);
            expect(t).toThrow(Error);
        });
        // prod issue 1
        it("should be able to process links in any order (backlog item rank example 1)", () => {
            const list = new LinkedList<number>();
            list.addInitialLink("e522", "e9d6");
            list.addInitialLink("e9d6", "2da6");
            list.addInitialLink("2da6", null);
            list.addInitialLink("aa81", "b2ca");
            list.addInitialLink("3996", "aa81");
            list.addInitialLink("b2ca", "e522");
            list.addInitialLink(null, "fdd2");
            list.addInitialLink("fdd2", "3996");
            expect(list.isFirstItem("fdd2")).toBeTruthy();
            expect(list.isLastItem("2da6")).toBeTruthy();
            expect(list.toIdArray()).toStrictEqual(["fdd2", "3996", "aa81", "b2ca", "e522", "e9d6", "2da6"]);
        });
        // prod issue 2
        it("should be able to process links in any order (backlog item rank example 2)", () => {
            const list = new LinkedList<number>();
            list.addInitialLink("fdd3", null);
            list.addInitialLink("87b0", "4432");
            list.addInitialLink("4432", "363c");
            list.addInitialLink("363c", "fdd3");
            list.addInitialLink("0290", "87b0");
            list.addInitialLink(null, "0290");
            expect(list.isFirstItem("0290")).toBeTruthy();
            expect(list.isLastItem("fdd3")).toBeTruthy();
            expect(list.toIdArray()).toStrictEqual(["0290", "87b0", "4432", "363c", "fdd3"]);
        });
        // prod issue 3
        it("should be able to process links in any order (backlog item rank example 3)", () => {
            const backlogItemRankDb = [
                { backlogitemId: "87b0ae7bfa0b450680e493e034a21e60", nextbacklogitemId: "4432c293678146669fcc955259e3f997" },
                { backlogitemId: "4432c293678146669fcc955259e3f997", nextbacklogitemId: "363cf6c8872f4c56a2a2c3a9d4faa623" },
                { backlogitemId: "fdd3a0a5f2934202b3943f2a5cc049e6", nextbacklogitemId: null },
                { backlogitemId: "363cf6c8872f4c56a2a2c3a9d4faa623", nextbacklogitemId: "02904cd94347403783b101c961b286f9" },
                { backlogitemId: "02904cd94347403783b101c961b286f9", nextbacklogitemId: "2dcab74955094c1ca859c638d132f8d6" },
                { backlogitemId: "2dcab74955094c1ca859c638d132f8d6", nextbacklogitemId: "ff907e488d8c4b2dab9177cb10d56886" },
                { backlogitemId: null, nextbacklogitemId: "87b0ae7bfa0b450680e493e034a21e60" },
                { backlogitemId: "0f13db1ab310436aad8263d35da97059", nextbacklogitemId: "fdd3a0a5f2934202b3943f2a5cc049e6" },
                { backlogitemId: "740c116a3cbb4c5ca15f2a9c1ce158cc", nextbacklogitemId: "0f13db1ab310436aad8263d35da97059" },
                { backlogitemId: "ff907e488d8c4b2dab9177cb10d56886", nextbacklogitemId: "740c116a3cbb4c5ca15f2a9c1ce158cc" }
            ];
            const list = new LinkedList<string>();
            backlogItemRankDb.forEach((backlogItem) => {
                list.addInitialLink(backlogItem.backlogitemId, backlogItem.nextbacklogitemId);
            });
            const backlogItemDb = [
                { id: "02904cd94347403783b101c961b286f9", externalId: "gh-116" },
                { id: "fdd3a0a5f2934202b3943f2a5cc049e6", externalId: "gh-98" },
                { id: "4432c293678146669fcc955259e3f997", externalId: "gh-114" },
                { id: "363cf6c8872f4c56a2a2c3a9d4faa623", externalId: "gh-115" },
                { id: "87b0ae7bfa0b450680e493e034a21e60", externalId: "gh-113" },
                { id: "2dcab74955094c1ca859c638d132f8d6", externalId: "gh-119" },
                { id: "ff907e488d8c4b2dab9177cb10d56886", externalId: null },
                { id: "740c116a3cbb4c5ca15f2a9c1ce158cc", externalId: "gh-133" },
                { id: "0f13db1ab310436aad8263d35da97059", externalId: "gh-131" }
            ];
            backlogItemDb.forEach((item) => {
                list.addItemData(item.id, item.externalId);
            });
            const result = list.toArray();
            expect(result).toStrictEqual(["gh-113", "gh-114", "gh-115", "gh-116", "gh-119", null, "gh-133", "gh-131", "gh-98"]);
        });
    });
    describe("toArray", () => {
        it("should handle empty list correctly", () => {
            const list = new LinkedList();
            const result = list.toArray();
            expect(result.length).toEqual(0);
        });
        it("should handle link without data, but still include item as undefined", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item1");
            list.addInitialLink("item1", "item2");
            list.addInitialLink("item2", null);
            list.addItemData("item1", { someObjField: "nothing important" });
            const result = list.toArray();
            expect(result).toStrictEqual([{ someObjField: "nothing important" }, undefined]);
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
});
