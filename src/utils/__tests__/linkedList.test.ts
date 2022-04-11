// test related
import "jest";

// code under test
import { LinkedList } from "../linkedList";

describe("Linked List", () => {
    describe("addInitialLink", () => {
        it("should set head and tail correctly for two linked items (when head and tail linked first)", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item-c");
            list.addInitialLink("item-d", null);
            list.addInitialLink("item-c", "item-d");
            expect(list.isFirstItem("item-c")).toBeTruthy();
            expect(list.isLastItem("item-d")).toBeTruthy();
        });
        it("should set head and tail correctly for two linked items (even when tail linked last)", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item-c");
            list.addInitialLink("item-c", "item-d");
            list.addInitialLink("item-d", null);
            expect(list.isFirstItem("item-c")).toBeTruthy();
            expect(list.isLastItem("item-d")).toBeTruthy();
        });
        it("should set head and tail correctly for a single item", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item1-b");
            list.addInitialLink("item1-b", null);
            expect(list.isFirstItem("item1-b")).toBeTruthy();
            expect(list.isLastItem("item1-b")).toBeTruthy();
        });
        it("should handle setting up the same link twice", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item1-a");
            list.addInitialLink("item1-a", "item1-b");
            list.addInitialLink("item1-a", "item1-b");
            list.addInitialLink("item1-b", null);
            expect(list.isFirstItem("item1-a")).toBeTruthy();
            expect(list.isLastItem("item1-b")).toBeTruthy();
        });
        it("should not throw an error linking head item twice", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "item-a");
            list.addInitialLink("item-a", null);
            list.addInitialLink(null, "item-a");
            expect(list.isFirstItem("item-a")).toBeTruthy();
            expect(list.isLastItem("item-a")).toBeTruthy();
        });
        it("should throw error when linking 2 null item IDs", () => {
            const list = new LinkedList();
            const t = () => list.addInitialLink(null, null);
            expect(t).toThrow(Error);
        });
        it("should throw error if you link the same ID to 2 different 'next' IDs", () => {
            const list = new LinkedList();
            list.addInitialLink("1", "2");
            const t = () => list.addInitialLink("1", "3");
            expect(t).toThrow(Error);
        });
        it("should throw error if you link the same ID to 2 different 'prev' IDs", () => {
            const list = new LinkedList();
            list.addInitialLink("1", "2");
            const t = () => list.addInitialLink("4", "2");
            expect(t).toThrow(Error);
        });
    });
    describe("addItemAfter", () => {
        it("should throw an error when adding an item with ID null", () => {
            const list = new LinkedList();
            const t = () => list.addItemAfter(null, "1", {});
            expect(t).toThrow(Error);
        });
        it("should throw an error when adding an item ID twice when using throwErrorForDups option", () => {
            const list = new LinkedList();
            const options = { throwErrorForDups: true, requireItemIdExistance: false };
            list.addArray("id", [{ id: "1" }, { id: "3" }]);
            list.addItemAfter("2", "3", {}, options);
            const t = () => list.addItemAfter("2", "3", {}, options);
            expect(t).toThrow(Error);
        });
        it("should not throw an error when adding an item ID twice when not using throwErrorForDups option", () => {
            const list = new LinkedList();
            const options = { throwErrorForDups: false, requireItemIdExistance: false };
            list.addArray("id", [{ id: "1" }, { id: "3" }]);
            list.addItemAfter("2", "3", {}, options);
            list.addItemAfter("2", "3", {}, options);
        });
        it("should not throw an error when requireItemIdExistance set to false", () => {
            const list = new LinkedList();
            const options = { throwErrorForDups: false, requireItemIdExistance: false };
            list.addItemAfter("2", "3", {}, options);
        });
        it("should throw an error when requireItemIdExistance set to true (the default setting)", () => {
            const list = new LinkedList();
            const t = () => list.addItemAfter("new", "missing", {});
            expect(t).toThrow(Error);
        });
        // it("should throw error if you link the same ID to 2 different 'prev' IDs", () => {
        //     const list = new LinkedList();
        //     list.addInitialLink("1", "2");
        //     const t = () => list.addInitialLink("4", "2");
        //     expect(t).toThrow(Error);
        // });
    });
    describe("addItemBefore", () => {
        it("should throw an error when adding an item with ID null", () => {
            const list = new LinkedList();
            const t = () => list.addItemBefore(null, "1", {});
            expect(t).toThrow(Error);
        });
        it("should throw an error when adding an item ID twice when using throwErrorForDups option", () => {
            const list = new LinkedList();
            const options = { throwErrorForDups: true, requireItemIdExistance: false };
            list.addArray("id", [{ id: "1" }, { id: "3" }]);
            list.addItemBefore("2", "3", {}, options);
            const t = () => list.addItemBefore("2", "3", {}, options);
            expect(t).toThrow(Error);
        });
        it("should not throw an error when adding an item ID twice when not using throwErrorForDups option", () => {
            const list = new LinkedList();
            const options = { throwErrorForDups: false, requireItemIdExistance: false };
            list.addArray("id", [{ id: "1" }, { id: "3" }]);
            list.addItemBefore("2", "3", {}, options);
            list.addItemBefore("2", "3", {}, options);
        });
        it("should not throw an error when requireItemIdExistance set to false", () => {
            const list = new LinkedList();
            const options = { throwErrorForDups: false, requireItemIdExistance: false };
            list.addItemBefore("2", "3", {}, options);
        });
        it("should throw an error when requireItemIdExistance set to true (the default setting)", () => {
            const list = new LinkedList();
            const t = () => list.addItemBefore("new", "missing", {});
            expect(t).toThrow(Error);
        });
        // it("should throw error if you link the same ID to 2 different 'prev' IDs", () => {
        //     const list = new LinkedList();
        //     list.addInitialLink("1", "2");
        //     const t = () => list.addInitialLink("4", "2");
        //     expect(t).toThrow(Error);
        // });
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
    describe("toIdArray", () => {
        it("should handle a simple linked list", () => {
            const list = new LinkedList();
            list.addInitialLink(null, "1");
            list.addInitialLink("1", "2");
            list.addInitialLink("2", null);
            const result = list.toIdArray();
            expect(result).toStrictEqual(["1", "2"]);
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
    describe("addArray2", () => {
        it("should handle empty array correctly", () => {
            const list = new LinkedList();
            list.addArray2("id", "id2", []);
            const result = list.toArray();
            expect(result.length).toEqual(0);
        });
        it("should handle single item array correctly", () => {
            const list = new LinkedList();
            list.addArray2("id", "id2", [{ id2: "1" }]);
            const result = list.toArray();
            expect(result.length).toEqual(1);
        });
        it("should reject a non-string ID column", () => {
            const list = new LinkedList();
            const t = () => list.addArray2("id", "id2", [{ id: 1234 }]);
            expect(t).toThrow(Error);
        });
        it("should not reject a non-string ID2 column", () => {
            const list = new LinkedList();
            list.addArray2("id", "id2", [{ id2: 1234 }]);
            const result = list.toArray();
            expect(result.length).toEqual(1);
        });
    });
    describe("isFirstItem", () => {
        it("should not find a first item with an ID of null", () => {
            const list = new LinkedList();
            const actual = list.isFirstItem(null);
            expect(actual).toBeFalsy();
        });
        it("should work correctly even when the list is empty", () => {
            const list = new LinkedList();
            const actual = list.isFirstItem("item");
            expect(actual).toBeFalsy();
        });
    });
    describe("isLastItem", () => {
        it("should not find a last item with an ID of null", () => {
            const list = new LinkedList();
            const actual = list.isLastItem(null);
            expect(actual).toBeFalsy();
        });
        it("should work correctly even when the list is empty", () => {
            const list = new LinkedList();
            const actual = list.isLastItem("item");
            expect(actual).toBeFalsy();
        });
    });
    describe("checkDataIntegrity", () => {
        it("should not throw error for empty list", () => {
            const list = new LinkedList();
            list.checkDataIntegrity();
        });
        it("should not throw error for simple ID list without data", () => {
            const list = new LinkedList();
            list.addArray("id", [{ id: "1" }, { id: "2" }]);
            list.checkDataIntegrity();
        });
        it("should throw error when items added without head and tail link", () => {
            const list = new LinkedList();
            list.addInitialLink("1", "2");
            const t = () => list.checkDataIntegrity();
            expect(t).toThrow(Error);
        });
        it("should throw error when items added without tail link", () => {
            const list = new LinkedList();
            list.addInitialLink("1", "2");
            list.addInitialLink(null, "1");
            const t = () => list.checkDataIntegrity();
            expect(t).toThrow(Error);
        });
    });
    describe("getItemNodeInfo", () => {
        it("should handle an empty list", () => {
            const list = new LinkedList();
            const actual = list.getItemNodeInfo("1");
            expect(actual).toBeNull();
        });
        it("should throw an error when retrieving ID null", () => {
            const list = new LinkedList();
            const t = () => list.getItemNodeInfo(null);
            expect(t).toThrow(Error);
        });
        it("should handle an empty list", () => {
            const list = new LinkedList();
            list.addInitialLink("1", "2");
            const actual = list.getItemNodeInfo("1");
            expect(actual).toStrictEqual({
                id: "1",
                nextId: "2",
                prevId: undefined
            });
        });
    });
    describe("buildId2Value", () => {
        it("should handle a simple numeric value correctly", () => {
            const list = new LinkedList();
            const actual = list.buildId2Value(1234);
            expect(actual).toEqual("id2-1234");
        });
        it("should handle a simple string value correctly", () => {
            const list = new LinkedList();
            const actual = list.buildId2Value("abcd");
            expect(actual).toEqual("id2-abcd");
        });
        it("should handle null value correctly", () => {
            const list = new LinkedList();
            const actual = list.buildId2Value(null);
            expect(actual).toStrictEqual(null);
        });
        it("should handle undefined value correctly", () => {
            const list = new LinkedList();
            const actual = list.buildId2Value(undefined);
            expect(actual).toStrictEqual(undefined);
        });
    });
    describe("addInitialLink + toArray - production issues", () => {
        it("should be able to process links in any order (product backlog item example 1)", () => {
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
        it("should be able to process links in any order (product backlog item example 2)", () => {
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
        it("should be able to process links in any order (product backlog item example 3)", () => {
            const productBacklogItemDb = [
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
            productBacklogItemDb.forEach((backlogItem) => {
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
});
