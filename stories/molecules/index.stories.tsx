// externals
import React from "react";
import { addDecorator, addParameters, storiesOf } from "@storybook/react";

// storybook
import { action } from "@storybook/addon-actions";
import { withKnobs, text, select, number } from "@storybook/addon-knobs";
import { withRootAttribute } from "storybook-addon-root-attribute";

// components
import {
    AddButton,
    BacklogItemCard,
    BacklogItemStatus,
    BacklogItemTypeEnum,
    EditButton,
    EditMode,
    HomeButton,
    RefreshButton,
    RemoveButton,
    SmartSpinner,
    SpinnerAction,
    SpinnerSize,
    SpinnerTextPosition,
    SprintDatePicker,
    SprintDatePickerMode
} from "../../dist/index.es";

addDecorator(withRootAttribute);
addDecorator(withKnobs);
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
            startDate={new Date(2021, 0, 5)}
            finishDate={new Date(2021, 0, 18)}
            pickerMode={select(
                "pickerMode",
                {
                    StartDate: SprintDatePickerMode.StartDate,
                    FinishDate: SprintDatePickerMode.FinishDate,
                    StartAndFinish: SprintDatePickerMode.StartAndFinish
                },
                SprintDatePickerMode.StartDate
            )}
        />
    </div>
));
