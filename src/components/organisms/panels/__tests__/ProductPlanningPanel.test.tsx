// externals
import * as React from "react";

// test related
import "jest";
import { render } from "@testing-library/react";

// consts/enums
import { EditMode } from "../../../common/componentEnums";
import { Source } from "../../../../reducers/enums";
import { BacklogItemStatus } from "../../../../types/backlogItemEnums";

// interfaces/types
import type { BacklogItemWithSource } from "../../../../reducers/backlogItems/backlogItemsReducerTypes";

// code under test
import { ProductPlanningPanel } from "../productPlanning/ProductPlanningPanel";

// utils
import { timeNow } from "../../../../utils/dateHelper";

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

const sourceToString = (source: Source) => {
    let result: string;
    switch (source) {
        case Source.Added: {
            result = "added";
            break;
        }
        case Source.Loaded: {
            result = "loaded";
            break;
        }
        case Source.Pushed: {
            result = "pushed";
            break;
        }
        default: {
            result = `unknown:${source}`;
        }
    }
    return result;
};

const buildExternalId = (source: Source, itemNumber: number) => {
    const suffix = sourceToString(source);
    return `item-${itemNumber}-${suffix}`;
};

const buildStoryPhrase = (source: Source, itemNumber: number) => {
    const sourceText = sourceToString(source);
    return `${sourceText} story ${itemNumber}`;
};

const buildId = (itemNumber: number) => {
    return `fake-id-${itemNumber}`;
};

const buildFriendlyId = (isStory: boolean, itemNumber: number) => {
    return isStory ? `s-${itemNumber}` : `i-${itemNumber}`;
};

const buildCommonItem = (
    source: Source,
    itemNumber: number,
    instanceId: number | null,
    estimate: number,
    saved: boolean = true
): BacklogItemWithSource => ({
    acceptanceCriteria: "",
    createdAt: timeNow(),
    estimate,
    externalId: buildExternalId(source, itemNumber),
    friendlyId: buildFriendlyId(true, itemNumber),
    id: buildId(itemNumber),
    instanceId,
    projectId: null,
    reasonPhrase: null,
    rolePhrase: null,
    saved,
    source,
    storyPhrase: buildStoryPhrase(source, itemNumber),
    type: "story",
    updatedAt: timeNow(),
    status: BacklogItemStatus.NotStarted,
    startedAt: new Date(2020, 11, 27, 19, 7, 32),
    finishedAt: new Date(2020, 11, 27, 19, 7, 32),
    acceptedAt: new Date(2020, 11, 27, 19, 7, 32),
    releasedAt: new Date(2020, 11, 27, 19, 7, 32),
    partIndex: 1,
    storyEstimate: estimate,
    totalParts: 1,
    unallocatedParts: 0,
    unallocatedPoints: 0,
    saving: false
});

const buildAddedItem = (itemNumber: number, instanceId: number | null, estimate: number, saved: boolean): BacklogItemWithSource =>
    buildCommonItem(Source.Added, itemNumber, instanceId, estimate, saved);

const buildLoadedItem = (itemNumber: number, estimate: number): BacklogItemWithSource =>
    buildCommonItem(Source.Loaded, itemNumber, null, estimate);

describe("ProductPlanningPanel", () => {
    it("should include spacing between added items, action buttons and loaded items", () => {
        const allItems = [];
        allItems.push(buildAddedItem(1, 1000, 13, false));
        allItems.push(buildLoadedItem(2, 8));
        allItems.push(buildLoadedItem(3, 3));
        const editMode = EditMode.Edit;
        const strictMode = false;
        const wrapper = render(
            <ProductPlanningPanel
                allItems={allItems}
                busyJoiningUnallocatedParts={false}
                busySplittingStory={false}
                editMode={editMode}
                onAddNewBacklogItemForm={() => {}}
                onReorderBacklogItems={() => {}}
                openedDetailMenuBacklogItemId={null}
                renderMobile
                strictMode
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
        const strictMode = false;
        const wrapper = render(
            <ProductPlanningPanel
                allItems={allItems}
                busyJoiningUnallocatedParts={false}
                busySplittingStory={false}
                editMode={editMode}
                onAddNewBacklogItemForm={() => {}}
                onReorderBacklogItems={() => {}}
                openedDetailMenuBacklogItemId={null}
                renderMobile
                strictMode
            />
        );
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should not include double spacing between added saved, added unsaved and action buttons", () => {
        const allItems = [];
        allItems.push(buildAddedItem(1, 3000, 13, true));
        allItems.push(buildAddedItem(2, 3001, 5, false));
        const editMode = EditMode.Edit;
        const strictMode = false;
        const wrapper = render(
            <ProductPlanningPanel
                allItems={allItems}
                busyJoiningUnallocatedParts={false}
                busySplittingStory={false}
                editMode={editMode}
                onAddNewBacklogItemForm={() => {}}
                onReorderBacklogItems={() => {}}
                openedDetailMenuBacklogItemId={null}
                renderMobile
                strictMode
            />
        );
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should handle scenario where unsaved form visible and user switches from edit to view mode", () => {
        const allItems = [];
        allItems.push(buildAddedItem(1, 4000, 13, false));
        allItems.push(buildLoadedItem(2, 8));
        const editMode = EditMode.View;
        const strictMode = false;
        const wrapper = render(
            <ProductPlanningPanel
                allItems={allItems}
                busyJoiningUnallocatedParts={false}
                busySplittingStory={false}
                editMode={editMode}
                onAddNewBacklogItemForm={() => {}}
                onReorderBacklogItems={() => {}}
                openedDetailMenuBacklogItemId={null}
                renderMobile
                strictMode
            />
        );
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should handle scenario where 3 unsaved added items shown in sequence", () => {
        const allItems = [];
        allItems.push(buildAddedItem(1, 5000, 13, false));
        allItems.push(buildAddedItem(2, 5001, 8, false));
        allItems.push(buildAddedItem(3, 5002, 5, false));
        allItems.push(buildLoadedItem(4, 8));
        const editMode = EditMode.Edit;
        const strictMode = false;
        const wrapper = render(
            <ProductPlanningPanel
                allItems={allItems}
                busyJoiningUnallocatedParts={false}
                busySplittingStory={false}
                editMode={editMode}
                onAddNewBacklogItemForm={() => {}}
                onReorderBacklogItems={() => {}}
                openedDetailMenuBacklogItemId={null}
                renderMobile
                strictMode
            />
        );
        expect(wrapper.container).toMatchSnapshot();
    });
});
