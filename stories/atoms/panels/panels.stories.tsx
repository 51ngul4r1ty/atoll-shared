/* eslint-disable security/detect-object-injection */
// externals
import * as React from "react";

// storybook
import { storiesOf } from "@storybook/react";

// components
import { CalendarPanel, CaretPosition, ItemMenuPanel, RemoveButton } from "../../../dist/index.es";

// common
import "../../storybook";

storiesOf("Atoms/Panels", module)
    .add("ItemMenuPanel (caret top-center)", () => (
        <ItemMenuPanel
            className="item-menu-panel caret-top-center"
            caretPosition={CaretPosition.TopCenter}
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
            caretPosition={CaretPosition.RightTop}
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
            dateSelected={new Date(2021, 0, 5)}
            sprints={[
                {
                    start: new Date(2020, 11, 22),
                    finish: new Date(2021, 0, 4),
                    editing: false
                },
                {
                    start: new Date(2021, 0, 5),
                    finish: new Date(2021, 0, 18),
                    editing: true
                }
            ]}
        ></CalendarPanel>
    ));
