// externals
import * as React from "react";
import { useDispatch } from "react-redux";

// interfaces/types
import { BacklogItemWithSource } from "../../../reducers/backlogItemsReducer";
import { EditMode } from "../../molecules/buttons/EditButton";
import { SimpleDivider } from "../../atoms/dividers/SimpleDivider";
import { BacklogItemDetailForm } from "../forms/BacklogItemDetailForm";
import { BacklogItemCard, BacklogItemTypeEnum } from "../../molecules/cards/BacklogItemCard";
import { buildClassName } from "../../../utils/classNameBuilder";

// actions
import {
    updateBacklogItemFields,
    saveNewBacklogItem,
    cancelUnsavedBacklogItem,
    backlogItemDetailClicked,
    removeBacklogItem,
    editBacklogItem,
    cancelEditBacklogItem,
    updateBacklogItem
} from "../../../actions/backlogItems";

// style
import css from "./BacklogItemPlanningItem.module.css";

export interface BacklogItemPlanningItemStateProps extends BacklogItemWithSource {
    editMode: EditMode;
    highlightAbove: boolean;
    renderMobile: boolean;
    showDetailMenu: boolean;
    suppressTopPadding: boolean;
}

export interface BacklogItemPlanningItemDispatchProps {}

export type BacklogItemPlanningItemProps = BacklogItemPlanningItemStateProps & BacklogItemPlanningItemDispatchProps;

export const BacklogItemPlanningItem: React.FC<BacklogItemPlanningItemProps> = (props) => {
    const dispatch = useDispatch();
    if (props.editMode === EditMode.Edit && (!props.saved || props.editing)) {
        const classNameToUse = buildClassName(
            css.backlogItemUserStoryFormRow,
            props.suppressTopPadding ? null : css.embeddedBacklogItemUserStoryFormRow
        );
        return (
            <>
                <SimpleDivider key={`divider-unsaved-form-${props.instanceId}`} />
                <BacklogItemDetailForm
                    key={`unsaved-form-${props.instanceId}`}
                    className={classNameToUse}
                    id={props.id}
                    instanceId={props.instanceId}
                    externalId={props.externalId}
                    editing
                    estimate={props.estimate}
                    rolePhrase={props.rolePhrase}
                    storyPhrase={props.storyPhrase}
                    reasonPhrase={props.reasonPhrase}
                    type={props.type}
                    renderMobile={props.renderMobile}
                    onDataUpdate={(fields) => {
                        dispatch(updateBacklogItemFields(fields));
                    }}
                    onDoneClick={(id, instanceId) => {
                        if (id) {
                            dispatch(updateBacklogItem(id));
                        } else {
                            dispatch(saveNewBacklogItem(instanceId));
                        }
                    }}
                    onCancelClick={(id, instanceId) => {
                        if (id) {
                            dispatch(cancelEditBacklogItem(id));
                        } else {
                            dispatch(cancelUnsavedBacklogItem(instanceId));
                        }
                    }}
                />
            </>
        );
    } else {
        return (
            <>
                <SimpleDivider key={`divider-saved-${props.id}`} highlighted={props.highlightAbove} />
                <BacklogItemCard
                    key={props.id}
                    estimate={props.estimate}
                    internalId={`${props.id}`}
                    itemId={`${props.externalId}`}
                    itemType={props.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
                    titleText={props.storyPhrase}
                    isDraggable={props.editMode === EditMode.Edit}
                    hasDetails={props.editMode === EditMode.Edit}
                    renderMobile={props.renderMobile}
                    marginBelowItem
                    pushState={props.pushState}
                    onDetailClicked={() => {
                        dispatch(backlogItemDetailClicked(props.id));
                    }}
                    onRemoveItemClicked={(backlogItemId) => {
                        dispatch(removeBacklogItem(props.id));
                    }}
                    onEditItemClicked={(itemId: string) => {
                        dispatch(editBacklogItem(props.id));
                    }}
                    showDetailMenu={props.showDetailMenu}
                />
            </>
        );
    }
};
