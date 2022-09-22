// externals
import React from "react";
import { addDecorator, addParameters, storiesOf } from "@storybook/react";

// storybook
import { action } from "@storybook/addon-actions";
import { withKnobs, text, select, number, boolean } from "@storybook/addon-knobs";
import { withRootAttribute } from "storybook-addon-root-attribute";

// components
import {
    AddButton,
    BacklogItemCard,
    BacklogItemStatus,
    BacklogItemTypeEnum,
    DateInput,
    DateInputPickerMode,
    DateOnly,
    EditButton,
    EditMode,
    HomeButton,
    ItemMenuPanelCaretPosition,
    ProjectPickerMenu,
    RefreshButton,
    RemoveButton,
    SimpleButton,
    SmartSpinner,
    SpinnerAction,
    SpinnerSize,
    SpinnerTextPosition,
    SplitButtonIcon,
    SprintDatePicker,
    SprintDatePickerMode
} from "../../dist/index.es";

addDecorator(withRootAttribute);
addDecorator(withKnobs({ escapeHTML: false }));
addParameters({
    rootAttribute: {
        root: "html",
        attribute: "class",
        defaultState: {
            name: "Default",
            value: "theme-default"
        },
        states: [
            {
                name: "Dark",
                value: "theme-dark"
            }
        ]
    }
});

const splitIcon = <SplitButtonIcon />;

storiesOf("Molecules/Buttons", module).add("SimpleButton", () => (
    <div>
        <SimpleButton
            disabled={boolean("disabled", false)}
            draggable={boolean("draggable", false)}
            icon={splitIcon}
            iconOnLeft={boolean("iconOnLeft", true)}
            noWrap={boolean("noWrap", false)}
            suppressSpacing={boolean("suppressSpacing", false)}
            busy={boolean("busy", false)}
        >
            {text("children", "Button Caption")}
        </SimpleButton>
    </div>
));

storiesOf("Molecules/Buttons/HomeButton", module)
    .add("HomeButton (default)", () => <HomeButton onClick={action("clicked")} />)
    .add("HomeButton (hover)", () => <HomeButton forceStateHover onClick={action("clicked")} />)
    .add("HomeButton (active)", () => <HomeButton forceStateActive onClick={action("clicked")} />)
    .add("HomeButton (focus)", () => <HomeButton forceStateFocus onClick={action("clicked")} />);

let activeTabId = "plan";

storiesOf("Molecules/Cards/BacklogItemCard", module)
    .add("BacklogItemCard", () => (
        <div className="all-devices">
            <BacklogItemCard
                itemId={text("itemId", "456")}
                itemType={select(
                    "itemType",
                    { Story: BacklogItemTypeEnum.Story, Bug: BacklogItemTypeEnum.Bug },
                    BacklogItemTypeEnum.Bug
                )}
                status={select(
                    "status",
                    {
                        None: BacklogItemStatus.None,
                        NotStarted: BacklogItemStatus.NotStarted,
                        InProgress: BacklogItemStatus.InProgress,
                        Done: BacklogItemStatus.Done,
                        Accepted: BacklogItemStatus.Accepted,
                        Released: BacklogItemStatus.Released
                    },
                    BacklogItemStatus.Done
                )}
                titleText={text("titleText", 'I can modify a story from "unplanned" to "planned"')}
                estimate={number("estimate", null)}
                isDraggable={boolean("isDraggable", false)}
                hasDetails={boolean("hasDetails", false)}
            />
        </div>
    ))
    .add("BacklogItemCard (story)", () => (
        <div className="all-devices">
            <BacklogItemCard
                itemId="gh-351"
                itemType={BacklogItemTypeEnum.Story}
                status={BacklogItemStatus.Done}
                roleText="As a develoer"
                titleText="I can see a stack trace in the logs when a server-side error occurs"
                reasonText="so that I can troubleshoot easier"
                estimate={2}
                hasDetails={false}
                isLoadingDetails={false}
            />
        </div>
    ))
    .add("BacklogItemCard (fraction)", () => (
        <div className="all-devices">
            <BacklogItemCard
                itemId={text("itemId", "123")}
                itemType={select(
                    "itemType",
                    { Story: BacklogItemTypeEnum.Story, Bug: BacklogItemTypeEnum.Bug },
                    BacklogItemTypeEnum.Story
                )}
                titleText={text("titleText", "A really, really small story")}
                estimate={0.5}
            />
        </div>
    ))
    .add("BacklogItemCard (split)", () => (
        <div className="all-devices">
            <BacklogItemCard
                itemId="gh-356"
                itemType={BacklogItemTypeEnum.Bug}
                roleText="As a developer"
                titleText="I can work with consistent *Fetcher exported result types"
                reasonText="so that the pattern is obvious"
                estimate={5}
                partIndex={2}
                totalParts={2}
                unallocatedParts={0}
                storyEstimate={13}
                status={BacklogItemStatus.Released}
            />
        </div>
    ))
    .add("BacklogItemCard (fraction split)", () => (
        <div className="all-devices">
            <BacklogItemCard
                itemId="gh-356"
                itemType={BacklogItemTypeEnum.Bug}
                roleText="As a developer"
                titleText="I can work with consistent *Fetcher exported result types"
                reasonText="so that the pattern is obvious"
                estimate={0.25}
                partIndex={2}
                totalParts={2}
                unallocatedParts={0}
                storyEstimate={0.5}
                status={BacklogItemStatus.Released}
            />
        </div>
    ))
    .add("BacklogItemCard (bug)", () => (
        <div className="all-devices">
            <BacklogItemCard
                itemId={text("itemId", "456")}
                itemType={BacklogItemTypeEnum.Bug}
                titleText={text("titleText", "Example bug")}
                estimate={number("estimate", null)}
            />
        </div>
    ))
    .add("BacklogItemCard (draggable)", () => (
        <div className="all-devices">
            <BacklogItemCard
                itemId={text("itemId", "456")}
                itemType={select(
                    "itemType",
                    { Story: BacklogItemTypeEnum.Story, Bug: BacklogItemTypeEnum.Bug },
                    BacklogItemTypeEnum.Bug
                )}
                titleText={text("titleText", "Example bug")}
                estimate={number("estimate", null)}
                isDraggable
                hasDetails
            />
        </div>
    ))
    .add("BacklogItemCard Mobile (draggable)", () => (
        <div className="all-devices mobile">
            <BacklogItemCard
                itemId={text("itemId", "456")}
                itemType={select(
                    "itemType",
                    { Story: BacklogItemTypeEnum.Story, Bug: BacklogItemTypeEnum.Bug },
                    BacklogItemTypeEnum.Bug
                )}
                titleText={text("titleText", "Example bug")}
                estimate={number("estimate", null)}
                isDraggable
                hasDetails
                renderMobile
            />
        </div>
    ))
    .add("BacklogItemCard Mobile (all elts)", () => (
        <div className="all-devices mobile">
            <BacklogItemCard
                itemId={text("itemId", "456")}
                itemType={select(
                    "itemType",
                    { Story: BacklogItemTypeEnum.Story, Bug: BacklogItemTypeEnum.Bug },
                    BacklogItemTypeEnum.Bug
                )}
                titleText={text("titleText", "Example bug")}
                estimate={number("estimate", null)}
                status={BacklogItemStatus.Done}
                isDraggable
                hasDetails
                renderMobile
            />
        </div>
    ));

storiesOf("Molecules/Buttons/EditButton", module)
    .add("EditButton (view mode)", () => (
        <div>
            <EditButton
                mode={select(
                    "mode",
                    {
                        View: EditMode.View,
                        Edit: EditMode.Edit
                    },
                    EditMode.View
                )}
                onClick={() => {
                    alert("clicked");
                }}
            />
        </div>
    ))
    .add("EditButton (edit mode)", () => (
        <div>
            <EditButton
                mode={select(
                    "mode",
                    {
                        View: EditMode.View,
                        Edit: EditMode.Edit
                    },
                    EditMode.Edit
                )}
                onClick={() => {
                    alert("clicked");
                }}
            />
        </div>
    ));

storiesOf("Molecules/Buttons/RefreshButton", module).add("RefreshButton", () => (
    <div>
        <RefreshButton
            onClick={() => {
                alert("clicked");
            }}
        />
    </div>
));

storiesOf("Molecules/Buttons/AddButton", module)
    .add("AddButton (story)", () => (
        <div>
            <AddButton
                itemName="Story"
                onClick={() => {
                    // eslint-disable-next-line no-alert
                    alert("add story clicked");
                }}
            />
        </div>
    ))
    .add("AddButton (bug)", () => (
        <div>
            <AddButton
                itemName="Bug"
                onClick={() => {
                    // eslint-disable-next-line no-alert
                    alert("add bug clicked");
                }}
            />
        </div>
    ));

storiesOf("Molecules/Buttons/RemoveButton", module).add("RemoveButton", () => (
    <div>
        <RemoveButton
            onClick={() => {
                // eslint-disable-next-line no-alert
                alert("remove clicked");
            }}
        />
    </div>
));

storiesOf("Molecules/Unique/SmartSpinner", module).add("SmartSpinner", () => (
    <div>
        <SmartSpinner
            metricKey="sprint-loader"
            metricEntityKey="sprint-1"
            action={select(
                "action",
                {
                    None: undefined,
                    Loading: SpinnerAction.Loading,
                    Calculating: SpinnerAction.Calculating
                },
                SpinnerAction.Loading
            )}
            entityNameTemplate={text("entityNameTemplate", "sprint backlog `${plural('item','items')}")}
            size={select(
                "size",
                {
                    None: undefined,
                    Small: SpinnerSize.Small,
                    Medium: SpinnerSize.Medium,
                    Large: SpinnerSize.Large
                },
                undefined
            )}
            textPosition={select(
                "textPosition",
                {
                    None: undefined,
                    OverSpinner: SpinnerTextPosition.OverSpinner,
                    BelowSpinner: SpinnerTextPosition.BelowSpinner
                },
                undefined
            )}
        />
    </div>
));

storiesOf("Molecules/Pickers/SprintDatePicker", module).add("SprintDatePicker", () => (
    <div>
        <SprintDatePicker
            className="calendar-panel"
            startDate={new DateOnly(2021, 1, 5)}
            finishDate={new DateOnly(2021, 1, 18)}
            pickerMode={select(
                "pickerMode",
                {
                    StartDate: SprintDatePickerMode.StartDate,
                    FinishDate: SprintDatePickerMode.FinishDate,
                    DateRange: SprintDatePickerMode.DateRange
                },
                SprintDatePickerMode.StartDate
            )}
        />
    </div>
));

const buildDateOnlyFromIsoString = (val: string): DateOnly => {
    const date = new Date(val);
    return new DateOnly(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

storiesOf("Molecules/Inputs/DateInput", module).add("DateInput", () => (
    <div id="dateinput-container" className="storybook-form-background">
        <div className="storybook-flex-flow">
            <DateInput
                className="dateinput-startDate"
                inputId="dateinput-container"
                itemType="startDate"
                caretPosition={ItemMenuPanelCaretPosition.TopLeft}
                labelText="Start"
                modalPanelEltId="dateinput-modal-panel"
                inputValue={buildDateOnlyFromIsoString(text("from.date", new DateOnly(2021, 1, 5).toISODateTime()))}
                pickerMode={DateInputPickerMode.RangeAltIsFinishDate}
                buildDatePicker={(
                    startDate: DateOnly | null | undefined,
                    finishDate: DateOnly | null | undefined,
                    pickingStartDate: boolean,
                    onDateChange: (date: DateOnly) => void
                ) => (
                    <SprintDatePicker
                        startDate={startDate}
                        finishDate={finishDate}
                        pickerMode={pickingStartDate ? SprintDatePickerMode.StartDate : SprintDatePickerMode.FinishDate}
                        suppressPadding
                        onStartDateChange={onDateChange}
                        onFinishDateChange={onDateChange}
                    />
                )}
                showPicker={boolean("from.showPicker", false)}
                rangeAltValue={buildDateOnlyFromIsoString(text("to.date", new DateOnly(2021, 1, 18).toISODateTime()))}
            />
            to
            <DateInput
                className="dateinput-startDate"
                inputId="dateinput-container"
                itemType="finishDate"
                caretPosition={ItemMenuPanelCaretPosition.TopRight}
                labelText="Finish"
                modalPanelEltId="dateinput-modal-panel"
                inputValue={buildDateOnlyFromIsoString(text("to.date", new DateOnly(2021, 1, 18).toISODateTime()))}
                pickerMode={DateInputPickerMode.RangeAltIsStartDate}
                buildDatePicker={(
                    startDate: DateOnly | null | undefined,
                    finishDate: DateOnly | null | undefined,
                    pickingStartDate: boolean,
                    onDateChange: (date: DateOnly) => void
                ) => (
                    <SprintDatePicker
                        startDate={startDate}
                        finishDate={finishDate}
                        pickerMode={pickingStartDate ? SprintDatePickerMode.StartDate : SprintDatePickerMode.FinishDate}
                        suppressPadding
                        onStartDateChange={onDateChange}
                        onFinishDateChange={onDateChange}
                    />
                )}
                showPicker={boolean("to.showPicker", true)}
                rangeAltValue={buildDateOnlyFromIsoString(text("from.date", new DateOnly(2021, 1, 5).toISODateTime()))}
            />
        </div>
        <div id="dateinput-modal-panel"></div>
    </div>
));

storiesOf("Molecules/Menus/ProjectPickerMenu", module).add("ProjectPickerMenu", () => (
    <div>
        <ProjectPickerMenu
            items={[
                {
                    itemId: "id-1",
                    itemCaption: "Project #1"
                },
                {
                    itemId: "id-2",
                    itemCaption: "Project #2"
                },
                {
                    itemId: "id-3",
                    itemCaption: "Project #3"
                }
            ]}
        />
    </div>
));
