// externals
import * as React from "react";
import { useDispatch } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { useFeatureToggle, ToggleFeature } from "@flopflip/react-broadcast";

// atoms
import { TabStrip } from "../../atoms/tabs/TabStrip";

// molecules
import { EditButton, EditMode } from "../../molecules/buttons/EditButton";
import { HomeButton } from "../../molecules/buttons/HomeButton";
import { RefreshButton } from "../../molecules/buttons/RefreshButton";

// style
import css from "./TopMenuPanel.module.css";
import { routePlanView, routeSprintView, routeReviewView } from "../../../actions/routeActions";

/* exported interfaces */

export interface TopMenuPanelStateProps {
    activeTabId?: string;
    editMode: EditMode;
    showRefreshButton: boolean;
}

export interface TopMenuPanelDispatchProps {
    onChangeTab?: { (selectedTabId: string) };
    setEditMode: { (editMode: EditMode) };
    refreshData: { () };
}

export type TopMenuPanelProps = TopMenuPanelStateProps & TopMenuPanelDispatchProps & WithTranslation;

/* exported components */

export const RawTopMenuPanel: React.FC<TopMenuPanelProps> = (props) => {
    const enableSprintTab = useFeatureToggle("enableSprintTab");
    const enableReviewTab = useFeatureToggle("enableReviewTab");
    const dispatch = useDispatch();
    const buttons = [];
    console.log(`RE-RENDERING showRefreshButton=${props.showRefreshButton}`);
    if (props.showRefreshButton) {
        buttons.push(
            <RefreshButton
                key="refresh-button"
                onClick={() => {
                    props.refreshData();
                }}
            />
        );
    }
    buttons.push(
        <ToggleFeature key="edit-button-key" flag="showEditButton">
            <EditButton
                key="edit-button"
                mode={props.editMode}
                onClick={() => {
                    props.setEditMode(props.editMode === EditMode.View ? EditMode.Edit : EditMode.View);
                }}
            />
        </ToggleFeature>
    );

    const tabs = [{ id: "plan", caption: props.t("Plan") }];
    if (enableSprintTab) {
        tabs.push({ id: "sprint", caption: props.t("Sprint") });
    }
    if (enableReviewTab) {
        tabs.push({ id: "review", caption: props.t("Review") });
    }

    return (
        <div className={css.topMenuPanel}>
            <HomeButton />
            <TabStrip
                activeTab={(props && props.activeTabId) || "plan"}
                tabs={tabs}
                onChange={(tabId) => {
                    switch (tabId) {
                        case "plan":
                            dispatch(routePlanView());
                            break;
                        case "sprint":
                            dispatch(routeSprintView());
                            break;
                        case "review":
                            dispatch(routeReviewView());
                            break;
                    }
                }}
            />
            <div className={css.fillSpaceAvailable}></div>
            <div className={css.actionButtonPanel}>{buttons}</div>
        </div>
    );
};

export const TopMenuPanel = withTranslation()(RawTopMenuPanel);
