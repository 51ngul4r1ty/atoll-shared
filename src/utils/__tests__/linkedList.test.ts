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
    });
});
