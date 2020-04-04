// externals
import * as React from "React";

// test related
import "jest";
import { render } from "@testing-library/react";

// code under test
import { BacklogItemPlanningPanel } from "../BacklogItemPlanningPanel";
import { EditMode } from "../../../molecules/buttons/EditButton";
import { BacklogItemWithSource, BacklogItemSource } from "../../../../reducers/backlogItemsReducer";

// mocks
const mockUseDispatch = jest.fn();
jest.mock("react-redux", () => ({
    useDispatch: () => mockUseDispatch()
}));
jest.mock("../../forms/BacklogItemDetailForm", () => ({
    BacklogItemDetailForm: () => "[Mock BacklogItemDetailForm]"
}));
jest.mock("react-i18next", () => ({
    withTranslation: () => (elt) => elt
}));

describe("BacklogItemPlanningPanel", () => {
    it("should include spacing between added items, action buttons and loaded items", () => {
        const allItems = [];
        const addedItem: BacklogItemWithSource = {
            source: BacklogItemSource.Added,
            creationDateTime: new Date(),
            estimate: 13,
            externalId: "added-item-1",
            reasonPhrase: null,
            storyPhrase: "added story 1",
            rolePhrase: null,
            type: "story",
            id: "fake-id-1"
        };
        allItems.push(addedItem);
        const editMode = EditMode.Edit;
        const wrapper = render(
            <BacklogItemPlanningPanel
                allItems={allItems}
                editMode={editMode}
                renderMobile
                onAddNewBacklogItem={() => {}}
                onReorderBacklogItems={() => {}}
            />
        );
        expect(wrapper.container).toMatchSnapshot();
    });
});
