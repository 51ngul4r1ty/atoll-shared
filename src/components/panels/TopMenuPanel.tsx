// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// components
import { HomeButton } from "../buttons/HomeButton";
import { TabStrip } from "../tabs/TabStrip";
import css from "./TopMenuPanel.module.css";

/* exported interfaces */

export interface TopMenuPanelAttributeProps {
    activeTabId?: string;
}

export interface TopMenuPanelEventProps {
    onChangeTab?: { (selectedTabId: string) };
}

export type TopMenuPanelProps = TopMenuPanelAttributeProps & TopMenuPanelEventProps & WithTranslation;

/* exported components */

export const RawTopMenuPanel: React.FC<TopMenuPanelProps> = (props) => (
    <div className={css.topMenuPanel}>
        <HomeButton />
        <TabStrip
            activeTab={(props && props.activeTabId) || "plan"}
            tabs={[
                { id: "plan", caption: props.t("Plan") },
                { id: "sprint", caption: props.t("Sprint") },
                { id: "review", caption: props.t("Review") }
            ]}
            onChange={(tabId) => {
                if (props && props.onChangeTab) {
                    props.onChangeTab(tabId);
                }
            }}
        />
    </div>
);

export const TopMenuPanel = withTranslation()(RawTopMenuPanel);
