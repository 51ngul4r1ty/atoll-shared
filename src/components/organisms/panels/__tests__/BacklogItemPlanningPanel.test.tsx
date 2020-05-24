// externals
import * as React from "react";

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
    BacklogItemDetailForm: (obj) => {
        return (
            `[Mock BacklogItemDetailForm className="${obj.className}" instanceId=${obj.instanceId} ` +
            `externalId=${obj.externalId} id=${obj.id}]`
        );
    }
}));
jest.mock("../../../molecules/cards/BacklogItemCard", () => {
    const result = {
        ...jest.requireActual("../../../molecules/cards/BacklogItemCard"),
        BacklogItemCard: (obj) =>
            `[Mock BacklogItemCard internalId=${obj.internalId} itemId=${obj.itemId} ` +
            `titleText="${obj.titleText}" marginBelowItem=${obj.marginBelowItem}]`
    };
    return result;
});
jest.mock("../../../atoms/dividers/SimpleDivider", () => ({
    SimpleDivider: () => "[Mock SimpleDivider]"
}));
jest.mock("../../../molecules/buttons/AddButton", () => ({
    AddButton: (obj) => `[Mock AddButton itemName=${obj.itemName}]`
}));
jest.mock("react-i18next", () => ({
    withTranslation: () => (elt) => elt
}));

const sourceToString = (source: BacklogItemSource) => {
    let result: string;
    switch (source) {
        case BacklogItemSource.Added: {
            result = "added";
            break;
        }
        case BacklogItemSource.Loaded: {
            result = "loaded";
            break;
        }
        case BacklogItemSource.Pushed: {
            result = "pushed";
            break;
        }
        default: {
            result = `unknown:${source}`;
        }
    }
    return result;
};

const buildExternalId = (source: BacklogItemSource, itemNumber: number) => {
    const suffix = sourceToString(source);
    return `item-${itemNumber}-${suffix}`;
};

const buildStoryPhrase = (source: BacklogItemSource, itemNumber: number) => {
    const sourceText = sourceToString(source);
    return `${sourceText} story ${itemNumber}`;
};

const buildId = (itemNumber: number) => {
    return `fake-id-${itemNumber}`;
};

const buildCommonItem = (
    source: BacklogItemSource,
    itemNumber: number,
    instanceId: number | null,
    estimate: number,
    saved: boolean = true
): BacklogItemWithSource => ({
    createdAt: new Date(),
    estimate,
    externalId: buildExternalId(source, itemNumber),
    id: buildId(itemNumber),
    instanceId,
    reasonPhrase: null,
    rolePhrase: null,
    saved,
    source,
    storyPhrase: buildStoryPhrase(source, itemNumber),
    type: "story"
});

const buildAddedItem = (itemNumber: number, instanceId: number | null, estimate: number, saved: boolean): BacklogItemWithSource =>
    buildCommonItem(BacklogItemSource.Added, itemNumber, instanceId, estimate, saved);

const buildLoadedItem = (itemNumber: number, estimate: number): BacklogItemWithSource =>
    buildCommonItem(BacklogItemSource.Loaded, itemNumber, null, estimate);

describe("BacklogItemPlanningPanel", () => {
    it("should include spacing between added items, action buttons and loaded items", () => {
        const allItems = [];
        allItems.push(buildAddedItem(1, 1000, 13, false));
        allItems.push(buildLoadedItem(1, 8));
        allItems.push(buildLoadedItem(2, 3));
        const editMode = EditMode.Edit;
        const wrapper = render(
            <BacklogItemPlanningPanel
                openedDetailMenuBacklogItemId={null}
                allItems={allItems}
                editMode={editMode}
                renderMobile
                onAddNewBacklogItem={() => {}}
                onReorderBacklogItems={() => {}}
            />
        );
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should include spacing between added saved, added unsaved, and loaded item", () => {
        const allItems = [];
        allItems.push(buildAddedItem(1, 2000, 13, true));
        allItems.push(buildAddedItem(2, 2001, 5, false));
        allItems.push(buildLoadedItem(3, 8));
        const editMode = EditMode.Edit;
        const wrapper = render(
            <BacklogItemPlanningPanel
                openedDetailMenuBacklogItemId={null}
                allItems={allItems}
                editMode={editMode}
                renderMobile
                onAddNewBacklogItem={() => {}}
                onReorderBacklogItems={() => {}}
            />
        );
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should not include double spacing between added saved, added unsaved and action buttons", () => {
        const allItems = [];
        allItems.push(buildAddedItem(1, 3000, 13, true));
        allItems.push(buildAddedItem(2, 3001, 5, false));
        const editMode = EditMode.Edit;
        const wrapper = render(
            <BacklogItemPlanningPanel
                openedDetailMenuBacklogItemId={null}
                allItems={allItems}
                editMode={editMode}
                renderMobile
                onAddNewBacklogItem={() => {}}
                onReorderBacklogItems={() => {}}
            />
        );
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should handle scenario where unsaved form visible and user switches from edit to view mode", () => {
        const allItems = [];
        allItems.push(buildAddedItem(1, 4000, 13, false));
        allItems.push(buildLoadedItem(3, 8));
        const editMode = EditMode.View;
        const wrapper = render(
            <BacklogItemPlanningPanel
                openedDetailMenuBacklogItemId={null}
                allItems={allItems}
                editMode={editMode}
                renderMobile
                onAddNewBacklogItem={() => {}}
                onReorderBacklogItems={() => {}}
            />
        );
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should handle scenario where 3 unsaved added items shown in sequence", () => {
        const allItems = [];
        allItems.push(buildAddedItem(1, 5000, 13, false));
        allItems.push(buildAddedItem(1, 5001, 8, false));
        allItems.push(buildAddedItem(1, 5002, 5, false));
        allItems.push(buildLoadedItem(3, 8));
        const editMode = EditMode.Edit;
        const wrapper = render(
            <BacklogItemPlanningPanel
                openedDetailMenuBacklogItemId={null}
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
