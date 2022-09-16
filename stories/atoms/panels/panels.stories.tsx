/* eslint-disable security/detect-object-injection */
// externals
import * as React from "react";

// storybook
import { storiesOf } from "@storybook/react";
import { boolean } from "@storybook/addon-knobs";

// components
import { CalendarPanel, ItemMenuPanelCaretPosition, ItemMenuPanel, RemoveButton, DateOnly } from "../../../dist/index.es";

// common
import "../../storybook";

storiesOf("Atoms/Panels", module)
    .add("ItemMenuPanel (caret top-center)", () => (
        <ItemMenuPanel
            className="item-menu-panel caret-top-center"
            caretPosition={ItemMenuPanelCaretPosition.TopCenter}
            loading={boolean("loading", false)}
            onClose={() => {
                alert("close triggered");
            }}
        >
            <RemoveButton
                onClick={() => {
                    alert("remove clicked");
                }}
            />
        </ItemMenuPanel>
    ))
    .add("ItemMenuPanel (caret right-top)", () => (
        <ItemMenuPanel
            className="item-menu-panel caret-right-top"
            caretPosition={ItemMenuPanelCaretPosition.RightTop}
            loading={boolean("loading", false)}
            onClose={() => {
                alert("close triggered");
            }}
        >
            <RemoveButton
                onClick={() => {
                    alert("remove clicked");
                }}
            />
        </ItemMenuPanel>
    ))
    .add("CalendarPanel", () => (
        <CalendarPanel
            className="calendar-panel"
            dateSelected={new DateOnly(2021, 0, 5)}
            sprints={[
                {
                    start: new DateOnly(2020, 11, 22),
                    finish: new DateOnly(2021, 0, 4),
                    editing: false
                },
                {
                    start: new DateOnly(2021, 0, 5),
                    finish: new DateOnly(2021, 0, 18),
                    editing: true
                }
            ]}
            onDateClick={(date: any) => {
                alert(`${date} chosen`);
            }}
        ></CalendarPanel>
    ));
