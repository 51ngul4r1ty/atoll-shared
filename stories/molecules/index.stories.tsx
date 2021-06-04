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
    .add("BacklogItemCard (story)", () => (
        <div>
            <BacklogItemCard
                itemId={text("itemId", "123")}
                itemType={select(
                    "itemType",
                    { Story: BacklogItemTypeEnum.Story, Bug: BacklogItemTypeEnum.Bug },
                    BacklogItemTypeEnum.Story
                )}
                status={BacklogItemStatus.Done}
                titleText={text("titleText", "Example story")}
                estimate={number("estimate", 5)}
            />
        </div>
    ))
    .add("BacklogItemCard (fractions)", () => (
        <div>
            <BacklogItemCard
                itemId={text("itemId", "123")}
                itemType={select(
                    "itemType",
                    { Story: BacklogItemTypeEnum.Story, Bug: BacklogItemTypeEnum.Bug },
                    BacklogItemTypeEnum.Story
                )}
                titleText={text("titleText", "A really, really small story")}
                estimate={number("estimate", 0.5)}
            />
        </div>
    ))
    .add("BacklogItemCard (bug)", () => (
        <div>
            <BacklogItemCard
                itemId={text("itemId", "456")}
                itemType={select(
                    "itemType",
                    { Story: BacklogItemTypeEnum.Story, Bug: BacklogItemTypeEnum.Bug },
                    BacklogItemTypeEnum.Bug
                )}
                titleText={text("titleText", "Example bug")}
                estimate={number("estimate", null)}
            />
        </div>
    ))
    .add("BacklogItemCard (draggable)", () => (
        <div>
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
        <div>
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
        <div>
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

storiesOf("Molecules/Inputs/DateInput", module).add("DateInput", () => (
    <div className="storybook-form-background">
        <div className="storybook-flex-flow">
            <DateInput
                inputValue={new DateOnly(2021, 1, 5)}
                pickerMode={DateInputPickerMode.RangeAltIsFinishDate}
                rangeAltValue={new DateOnly(2021, 1, 18)}
            />
            to
            <DateInput
                inputValue={new DateOnly(2021, 1, 18)}
                pickerMode={DateInputPickerMode.RangeAltIsStartDate}
                rangeAltValue={new DateOnly(2021, 1, 5)}
            />
        </div>
    </div>
));
