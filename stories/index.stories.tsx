// externals
import React from "react";
import { addDecorator, addParameters, storiesOf, forceReRender } from "@storybook/react";

// storybook
import { action } from "@storybook/addon-actions";
import { withKnobs, text } from "@storybook/addon-knobs";
import { withRootAttribute } from "storybook-addon-root-attribute";

// components
import { Checkbox, SimpleText, Spinner, SpinnerShapePentagon, StandardInput, TabStrip } from "../dist/index.es";

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

storiesOf("Atoms/Font Sizes", module).add("Font Sizes", () => (
    <div>
        <h1>Font Sizes</h1>
        <ul>
            <li>
                <SimpleText size="xsmall">Extra Small</SimpleText>
            </li>
            <li>
                <SimpleText size="small">Small</SimpleText>
            </li>
            <li>
                <SimpleText size="medium">Medium</SimpleText>
            </li>
            <li>
                <SimpleText size="large">Large</SimpleText>
            </li>
            <li>
                <SimpleText size="xlarge">Extra Large</SimpleText>
            </li>
        </ul>
    </div>
));

storiesOf("Atoms/Inputs/Checkbox", module).add("Checkbox", () => (
    <div className="storybook-form-background">
        <Checkbox
            checked
            checkedValue="on"
            inputName="checkbox1"
            inputId="checkbox1"
            labelText="Remember me"
            onClick={action("clicked menu")}
        />
    </div>
));

storiesOf("Atoms/Inputs/Standard", module).add("Standard", () => (
    <div className="storybook-form-background">
        <StandardInput
            inputName="standardinput1"
            inputId="standardinput1"
            labelText="Standard Input"
            onClick={action("clicked menu")}
        />
    </div>
));

let activeTabId = "plan";

storiesOf("Atoms/Tabs/TabStrip", module).add("TabStrip", () => (
    <div>
        <TabStrip
            activeTab={text("activeTab", activeTabId)}
            tabs={[
                { id: text("tabs[0].id", "plan"), caption: text("tabs[0].caption", "Plan") },
                { id: text("tabs[1].id", "sprint"), caption: text("tabs[1].caption", "Sprint") },
                { id: text("tabs[2].id", "review"), caption: text("tabs[2].caption", "Review") }
            ]}
            onChange={(tabId) => {
                activeTabId = tabId;
                forceReRender();
            }}
        />
    </div>
));

const spinnerIcon = <SpinnerShapePentagon className="spinner-shape" />;

storiesOf("Atoms/Unique/Spinner", module).add("Spinner", () => (
    <div>
        <Spinner icon={spinnerIcon} />
    </div>
));
