// test related
import "jest";

// code under test
import { buildApiPayloadBaseForResource } from "../apiSelectors";

// interfaces/types
import { StateTree } from "../../reducers/rootReducer";

// mocked modules
import * as apiLinksReducer from "../../reducers/apiLinksReducer";
import { ApiLinkDefnMissingReason, LinkForItemResult } from "../../reducers/apiLinksReducer";

describe("API Selectors", () => {
    it("should throw a useful error message when the resource is not present", () => {
        jest.spyOn(apiLinksReducer, "getLinkForItem").mockImplementationOnce(
            (): LinkForItemResult => ({
                link: null,
                missingReason: ApiLinkDefnMissingReason.TypeNotFound
            })
        );
        const state = {} as StateTree;
        const actual = () => buildApiPayloadBaseForResource(state, "backlogItems", "self", "fake-id-1");
        expect(actual).toThrow(
            'Unable to obtain a "self" link for a "backlogItems" item with ID "fake-id-1 ("resource type "backlogItems" not found")'
        );
    });
    it("should throw a useful error message when the item is not present", () => {
        jest.spyOn(apiLinksReducer, "getLinkForItem").mockImplementationOnce(
            (): LinkForItemResult => ({
                link: null,
                missingReason: ApiLinkDefnMissingReason.ItemNotFound
            })
        );
        const state = {} as StateTree;
        const actual = () => buildApiPayloadBaseForResource(state, "backlogItems", "self", "fake-id-1");
        expect(actual).toThrow(
            'Unable to obtain a "self" link for a "backlogItems" item with ID "fake-id-1 ("resource item "fake-id-1" not found")'
        );
    });
    it("should throw a useful error message when the relative link type is not present", () => {
        jest.spyOn(apiLinksReducer, "getLinkForItem").mockImplementationOnce(
            (): LinkForItemResult => ({
                link: null,
                missingReason: ApiLinkDefnMissingReason.RelNotFound
            })
        );
        const state = {} as StateTree;
        const actual = () => buildApiPayloadBaseForResource(state, "backlogItems", "self", "fake-id-1");
        expect(actual).toThrow(
            'Unable to obtain a "self" link for a "backlogItems" item with ID "fake-id-1 ("resource rel self not found")'
        );
    });
});
