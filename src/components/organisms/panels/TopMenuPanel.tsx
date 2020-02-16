// externals
import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";

// atoms
import { TabStrip } from "../../atoms/tabs/TabStrip";

// molecules
import { HomeButton } from "../../molecules/buttons/HomeButton";
import { EditButton, EditMode } from "../../molecules/buttons/EditButton";

// style
import css from "./TopMenuPanel.module.css";
import { routePlanView, routeSprintView, routeReviewView } from "../../../actions/routeActions";

/* exported interfaces */

export interface TopMenuPanelStateProps {
    activeTabId?: string;
}

export interface TopMenuPanelDispatchProps {
    onChangeTab?: { (selectedTabId: string) };
}

export type TopMenuPanelProps = TopMenuPanelStateProps & TopMenuPanelDispatchProps & WithTranslation;

/* exported components */

export const RawTopMenuPanel: React.FC<TopMenuPanelProps> = (props) => {
    const [editMode, setEditMode] = useState(EditMode.View);
    const dispatch = useDispatch();
    return (
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
            <div className={css.actionButtonPanel}>
                <EditButton
                    mode={editMode}
                    onClick={() => {
                        setEditMode(editMode === EditMode.View ? EditMode.Edit : EditMode.View);
                    }}
                />
            </div>
        </div>
    );
};

export const TopMenuPanel = withTranslation()(RawTopMenuPanel);
