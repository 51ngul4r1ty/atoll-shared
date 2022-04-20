// externals
import React from "react";
import { Provider } from "react-redux";

// mock data
import configureStore from "redux-mock-store";

// storybook
import { storiesOf } from "@storybook/react";
import { number, text, select, boolean } from "@storybook/addon-knobs";

// interfaces/types
import type { BacklogItemPartForSplitForm } from "../../src/selectors/backlogItemPartSelectors";

// components
import {
    BacklogItemDetailForm,
    BacklogItemFullDetailForm,
    ProductPlanningPanel,
    BacklogItemStatus,
    BacklogItemWithSource,
    EditMode,
    LoginForm,
    PushState,
    Source,
    SprintCard,
    SprintPlanningPanel,
    SprintStatus
} from "../../dist/index.es";

const mockStore = configureStore();
const store = mockStore({});

const bugStoryPhrase = "Filter seems to be taking longer & longer (investigate)";

storiesOf("Organisms/Forms/BacklogItemDetailForm", module)
    .add("BacklogItemDetailForm (issue)", () => (
        <div>
            <BacklogItemDetailForm
                id="1"
                type={select("type", ["issue", "story"], "issue")}
                estimate={number("estimate", 13)}
                friendlyId={text("friendlyId", "i-42")}
                externalId={text("externalId", "B1000032")}
                rolePhrase={text("rolePhrase", null)}
                storyPhrase={text("storyPhrase", bugStoryPhrase)}
                reasonPhrase={text("reasonPhrase", null)}
                editing={boolean("editing", false)}
                instanceId={number("instanceId", 1)}
            />
        </div>
    ))
    .add("BacklogItemDetailForm (story)", () => (
        <div>
            <BacklogItemDetailForm
                id="2"
                type={select("type", ["issue", "story"], "story")}
                estimate={number("estimate", 8)}
                friendlyId={text("friendlyId", "s-19")}
                externalId={text("externalId", "527")}
                rolePhrase={text("rolePhrase", "as a developer")}
                storyPhrase={text("storyPhrase", "use the v3 api to sign up a user")}
                reasonPhrase={text("reasonPhrase", "to allow for automation or a customized experience")}
                editing={boolean("editing", false)}
                instanceId={number("instanceId", 2)}
            />
        </div>
    ))
    .add("BacklogItemDetailForm Mobile (story)", () => (
        <div>
            <BacklogItemDetailForm
                id="3"
                type={select("type", ["issue", "story"], "story")}
                estimate={number("estimate", 8)}
                friendlyId={text("friendlyId", "s-19")}
                externalId={text("externalId", "527")}
                rolePhrase={text("rolePhrase", "as a developer")}
                storyPhrase={text("storyPhrase", "use the v3 api to sign up a user")}
                reasonPhrase={text("reasonPhrase", "to allow for automation or a customized experience")}
                editing={boolean("editing", false)}
                instanceId={number("instanceId", 2)}
                renderMobile
            />
        </div>
    ));

const allItems: BacklogItemWithSource[] = [
    {
        createdAt: undefined,
        updatedAt: undefined,
        estimate: null,
        friendlyId: "s-1",
        externalId: "id-1",
        id: "db-id-1",
        projectId: "project-1",
        reasonPhrase: null,
        rolePhrase: "As a developer",
        storyPhrase: "I can retrieve all backlog items",
        type: "story",
        saved: true,
        source: Source.Loaded
    },
    {
        createdAt: undefined,
        updatedAt: undefined,
        estimate: null,
        friendlyId: "s-2",
        externalId: "p-x",
        id: "db-pushed-id-x",
        projectId: "project-1",
        reasonPhrase: null,
        rolePhrase: null,
        storyPhrase: "Pushed item",
        type: "story",
        saved: true,
        source: Source.Pushed
    },
    {
        createdAt: undefined,
        updatedAt: undefined,
        estimate: null,
        friendlyId: "s-3",
        externalId: "id-2",
        id: "db-id-2",
        projectId: "project-1",
        reasonPhrase: null,
        rolePhrase: "As a developer",
        storyPhrase: "I can add a new backlog item",
        type: "story",
        saved: true,
        source: Source.Loaded
    },
    {
        createdAt: undefined,
        updatedAt: undefined,
        estimate: null,
        friendlyId: "s-4",
        externalId: "id-3",
        id: "db-id-3",
        projectId: "project-1",
        reasonPhrase: null,
        rolePhrase: "As a developer",
        storyPhrase: "I can delete a backlog item",
        type: "story",
        saved: true,
        source: Source.Loaded,
        pushState: PushState.Changed
    },
    {
        createdAt: undefined,
        updatedAt: undefined,
        estimate: null,
        friendlyId: "s-5",
        externalId: "id-4",
        id: "db-id-4",
        projectId: "project-1",
        reasonPhrase: null,
        rolePhrase: "As a developer",
        storyPhrase: "I can filter the list of backlog items",
        type: "story",
        saved: true,
        source: Source.Loaded,
        pushState: PushState.Removed
    }
];

for (let i = 5; i <= 50; i++) {
    allItems.push({
        createdAt: undefined,
        updatedAt: undefined,
        estimate: null,
        friendlyId: `s-${i}`,
        externalId: `id-${i}`,
        id: `db-id-${i}`,
        projectId: "project-1",
        reasonPhrase: null,
        rolePhrase: "As a developer",
        storyPhrase: `I can filter the list of backlog items (${i})`,
        type: "story",
        saved: true,
        source: Source.Loaded
    });
}

storiesOf("Molecules/Cards/SprintCard", module).add("SprintCard", () => (
    <div>
        <SprintCard
            id="sprint-1"
            name="Sprint 1"
            startDate={new Date(2020, 9, 14)}
            finishDate={new Date(2020, 9, 27)}
            status={SprintStatus.InProgress}
            plannedPoints={23}
            acceptedPoints={5}
            velocityPoints={0}
            usedSplitPoints={0}
            remainingSplitPoints={0}
            totalPoints={25}
            backlogItemsLoaded={false}
            backlogItems={null}
            expanded={false}
            saved={true}
            editing={false}
            instanceId={null}
            editMode={EditMode.View}
            openedDetailMenuBacklogItemId={undefined}
            renderMobile={false}
            selectedProductBacklogItemCount={4}
            onExpandCollapse={(id, expand) => {}}
            onAddBacklogItem={() => {}}
            onDetailClick={(backlogItemId: string) => {}}
            onMoveItemToBacklogClick={(backlogItemId: string) => {}}
            onSplitBacklogItemClick={(backlogItemId: string) => {}}
        />
    </div>
));

storiesOf("Organisms/Panels/SprintPlanningPanel", module).add("SprintPlanningPanel", () => (
    <div className="all-devices">
        <Provider store={store}>
            <SprintPlanningPanel
                editMode={select("editMode", { "EditMode.Edit": EditMode.Edit, "EditMode.View": EditMode.View }, EditMode.View)}
                openedDetailMenuInfo={undefined}
                openingDetailMenuInfo={undefined}
                selectedProductBacklogItemCount={0}
                sprints={[
                    {
                        id: "sprint-1",
                        acceptedPoints: 5,
                        backlogItems: [
                            {
                                acceptanceCriteria: "",
                                acceptedAt: null,
                                backlogItemPartId: "1",
                                createdAt: new Date(2019, 0, 1),
                                displayindex: 1,
                                estimate: 8,
                                externalId: "gh-123",
                                finishedAt: null,
                                friendlyId: "",
                                partIndex: number("partIndex", 1),
                                partPercentage: 0.5,
                                projectId: "",
                                reasonPhrase: "",
                                releasedAt: null,
                                rolePhrase: "As a user",
                                startedAt: null,
                                status: BacklogItemStatus.InProgress,
                                storyEstimate: 13,
                                storyFinishedAt: null,
                                storyPhrase: text("storyPhrase", "I can add a task under a user story"),
                                storyStartedAt: new Date(2019, 0, 1),
                                storyStatus: BacklogItemStatus.InProgress,
                                storyUpdatedAt: null,
                                totalParts: number("totalParts", 3),
                                type: "story",
                                unallocatedParts: 0,
                                unallocatedPoints: 0,
                                updatedAt: new Date(2019, 0, 1)
                            }
                        ],
                        backlogItemsLoaded: boolean("sprint[0].backlogItemsLoaded", false),
                        editing: false,
                        expanded: boolean("sprint[0].expanded", false),
                        finishDate: new Date(2020, 9, 28),
                        instanceId: 1,
                        name: "sprint name",
                        plannedPoints: 23,
                        remainingSplitPoints: 0,
                        saved: true,
                        startDate: new Date(2020, 9, 14),
                        status: SprintStatus.InProgress,
                        totalPoints: 25,
                        usedSplitPoints: 0,
                        velocityPoints: 20
                    }
                ]}
                onExpandCollapse={undefined}
                onAddBacklogItem={undefined}
                onAddNewSprintAfter={undefined}
                onAddNewSprintBefore={undefined}
                onDetailClick={undefined}
                onMoveItemToBacklogClick={undefined}
                onSplitBacklogItemClick={undefined}
            />
        </Provider>
    </div>
));

storiesOf("Organisms/Panels/ProductPlanningPanel", module).add("ProductPlanningPanel", () => (
    <div className="all-devices">
        <Provider store={store}>
            <ProductPlanningPanel
                allItems={allItems}
                editMode={EditMode.Edit}
                onAddNewBacklogItemForm={() => {
                    alert("add new backlog item");
                }}
                onReorderBacklogItems={() => {
                    alert("re-order backlog items");
                }}
                openedDetailMenuBacklogItemId={null}
            />
        </Provider>
    </div>
));

storiesOf("Organisms/Forms/LoginForm", module).add("LoginForm", () => (
    <div>
        <LoginForm username="username" password="password" />
    </div>
));

storiesOf("Organisms/Forms/BacklogItemFullDetailForm", module).add("BacklogItemFullDetailForm (issue)", () => {
    const part1: BacklogItemPartForSplitForm = {
        allocatedSprintId: text("split[0].allocatedSprintId", "123"),
        allocatedSprintName: text("split[0].allocatedSprintName", "Sprint 123"),
        externalId: text("split[0].externalId", "i-42-1"),
        backlogItemId: text("split[0].backlogItemId", "i-42-1"),
        partIndex: number("split[0].partIndex", 1),
        percentage: number("split[0].percentage", 75),
        points: number("split[0].plannedPoints", 10),
        id: text("split[0].partId", "1-1"),
        startedAt: null,
        finishedAt: null,
        status: select(
            "split[0].status",
            {
                "BacklogItemStatus.NotStarted": BacklogItemStatus.NotStarted,
                "BacklogItemStatus.InProgress": BacklogItemStatus.InProgress
            },
            BacklogItemStatus.NotStarted
        ),
        editable: boolean("split[0].editable", true),
        expanded: boolean("split[0].expanded", true)
    };
    const part2: BacklogItemPartForSplitForm = {
        allocatedSprintId: text("split[1].allocatedSprintId", ""),
        allocatedSprintName: text("split[1].allocatedSprintName", ""),
        externalId: text("split[1].externalId", "i-42-1"),
        backlogItemId: text("split[1].backlogItemId", "i-42-1"),
        partIndex: number("split[1].partIndex", 1),
        percentage: number("split[1].percentage", 25),
        points: number("split[1].plannedPoints", 3),
        id: text("split[1].partId", "1-1"),
        startedAt: null,
        finishedAt: null,
        status: select(
            "split[1].status",
            {
                "BacklogItemStatus.NotStarted": BacklogItemStatus.NotStarted,
                "BacklogItemStatus.InProgress": BacklogItemStatus.InProgress
            },
            BacklogItemStatus.NotStarted
        ),
        editable: boolean("split[1].editable", false),
        expanded: boolean("split[1].expanded", false)
    };
    return (
        <div>
            <Provider store={store}>
                <BacklogItemFullDetailForm
                    id="1"
                    saved={boolean("saved", false)}
                    type={select("type", ["issue", "story"], "issue")}
                    estimate={number("estimate", 13)}
                    friendlyId={text("friendlyId", "i-42")}
                    externalId={text("externalId", "B1000032")}
                    rolePhrase={text("rolePhrase", null)}
                    storyPhrase={text("storyPhrase", bugStoryPhrase)}
                    reasonPhrase={text("reasonPhrase", null)}
                    editable={boolean("editable", false)}
                    instanceId={number("instanceId", 1)}
                    parts={[part1, part2]}
                />
            </Provider>
        </div>
    );
});
