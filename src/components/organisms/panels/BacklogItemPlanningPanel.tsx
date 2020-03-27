// externals
import * as React from "react";
import { Dispatch } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./BacklogItemPlanningPanel.module.css";

// components
import { AddButton } from "../../molecules/buttons/AddButton";
import { BacklogItemCard, BacklogItemTypeEnum } from "../../molecules/cards/BacklogItemCard";
import { SimpleDivider } from "../../atoms/dividers/SimpleDivider";

// consts/enums
import { EditMode } from "../../molecules/buttons/EditButton";
import { BacklogItemDetailForm } from "../forms/BacklogItemDetailForm";
import { buildClassName } from "../../../utils/classNameBuilder";
import { useDispatch } from "react-redux";
import {
    BacklogItemType,
    BacklogItemWithSource,
    BacklogItemSource,
    SaveableBacklogItem
} from "../../../reducers/backlogItemsReducer";

// actions
import { updateBacklogItemFields, cancelUnsavedBacklogItem, saveBacklogItem } from "../../../actions/backlogItems";

/* exported interfaces */

export interface PlanningPanelBacklogItem {
    estimate: number | null;
    externalId: string;
    id: string;
    instanceId: number | null;
    storyPhrase: string;
    rolePhrase: string;
    reasonPhrase: string;
    type: BacklogItemType;
    saved: boolean;
}

export interface BacklogItemPlanningPanelStateProps {
    allItems: BacklogItemWithSource[];
    editMode: EditMode;
    renderMobile?: boolean;
}

export interface BacklogItemPlanningPanelDispatchProps {
    onAddNewBacklogItem: { (itemType: BacklogItemType) };
}

export type BacklogItemPlanningPanelProps = BacklogItemPlanningPanelStateProps &
    BacklogItemPlanningPanelDispatchProps &
    WithTranslation;

/* exported components */

export const buildBacklogItemElt = (
    editMode: EditMode,
    item: SaveableBacklogItem,
    renderMobile: boolean,
    highlightAbove: boolean,
    dispatch: Dispatch<any>
) => {
    if (!item.saved && editMode === EditMode.Edit) {
        return (
            <>
                <BacklogItemDetailForm
                    key={`unsaved-form-${item.instanceId}`}
                    className={css.backlogItemUserStoryFormRow}
                    instanceId={item.instanceId}
                    externalId={item.externalId}
                    editing
                    estimate={item.estimate}
                    rolePhrase={item.rolePhrase}
                    storyPhrase={item.storyPhrase}
                    reasonPhrase={item.reasonPhrase}
                    type={item.type}
                    onDataUpdate={(fields) => {
                        dispatch(updateBacklogItemFields(fields));
                    }}
                    onDoneClick={(instanceId) => {
                        dispatch(saveBacklogItem(instanceId));
                    }}
                    onCancelClick={(instanceId) => {
                        dispatch(cancelUnsavedBacklogItem(instanceId));
                    }}
                />
                <SimpleDivider />
            </>
        );
    }
    if (item.saved) {
        return (
            <>
                <SimpleDivider key={`divider-${item.id}`} highlighted={highlightAbove} />
                <BacklogItemCard
                    key={item.id}
                    estimate={item.estimate}
                    itemId={`${item.externalId}`}
                    itemType={item.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
                    titleText={item.storyPhrase}
                    isDraggable={editMode === EditMode.Edit}
                    renderMobile={renderMobile}
                    marginBelowItem
                />
            </>
        );
    }
};

export const RawBacklogItemPlanningPanel: React.FC<BacklogItemPlanningPanelProps> = (props) => {
    const dispatch = useDispatch();
    const classNameToUse = buildClassName(css.backlogItemPlanningPanel, props.renderMobile ? css.mobile : null);
    const actionButtons =
        props.editMode === EditMode.View ? null : (
            <div className={css.backlogItemPlanningActionPanel}>
                <AddButton
                    itemName="story"
                    onClick={() => {
                        props.onAddNewBacklogItem("story");
                    }}
                />
                <AddButton
                    itemName="issue"
                    onClick={() => {
                        props.onAddNewBacklogItem("issue");
                    }}
                />
            </div>
        );
    let inLoadedSection = false;
    let inAddedSection = false;
    let afterPushedItem = false;
    let renderElts = [];
    props.allItems.forEach((item) => {
        let highlightAbove = false;
        if (item.source === BacklogItemSource.Added) {
            inAddedSection = true;
            highlightAbove = afterPushedItem;
        }
        if (item.source === BacklogItemSource.Loaded) {
            highlightAbove = afterPushedItem;
            if (inAddedSection) {
                renderElts.push(<SimpleDivider />);
                inAddedSection = false;
            }
            if (!inLoadedSection) {
                renderElts.push(actionButtons);
            }
            inLoadedSection = true;
        }
        if (item.source === BacklogItemSource.Added || item.source === BacklogItemSource.Loaded) {
            const elt = buildBacklogItemElt(props.editMode, item, props.renderMobile, highlightAbove, dispatch);
            renderElts.push(elt);
        }
        afterPushedItem = item.source === BacklogItemSource.Pushed;
    });
    if (inLoadedSection) {
        renderElts.push(<SimpleDivider />);
    }

    return <div className={classNameToUse}>{renderElts}</div>;
};

export const BacklogItemPlanningPanel = withTranslation()(RawBacklogItemPlanningPanel);
