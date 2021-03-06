// externals
import * as React from "react";
import { useDispatch } from "react-redux";

// interfaces/types
import { BacklogItemWithSource } from "../../../reducers/backlogItems/backlogItemsReducerTypes";
import { SimpleDivider } from "../../atoms/dividers/SimpleDivider";
import { BacklogItemDetailForm } from "../forms/BacklogItemDetailForm";
import { BacklogItemCard, BacklogItemTypeEnum, ItemMenuEventHandlers } from "../../molecules/cards/BacklogItemCard";

// consts/enums
import { EditMode } from "../../common/componentEnums";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { buildBacklogDisplayId } from "../../../utils/backlogItemHelper";
import { productBacklogItemMenuBuilder } from "../../common/itemMenuBuilders";

// actions
import { apiDeleteBacklogItem } from "../../../actions/apiBacklogItems";
import {
    updateBacklogItemFields,
    saveNewBacklogItem,
    cancelUnsavedBacklogItem,
    backlogItemDetailClick,
    editBacklogItem,
    cancelEditBacklogItem,
    updateBacklogItem,
    selectProductBacklogItem,
    unselectProductBacklogItem,
    backlogItemIdClick
} from "../../../actions/backlogItemActions";

// style
import css from "./BacklogItemPlanningItem.module.css";

export interface BacklogItemPlanningItemStateProps extends BacklogItemWithSource {
    editMode: EditMode;
    highlightAbove: boolean;
    renderMobile: boolean;
    showDetailMenu: boolean;
    suppressTopPadding: boolean;
    hidden?: boolean;
}

export interface BacklogItemPlanningItemDispatchProps {}

export type BacklogItemPlanningItemProps = BacklogItemPlanningItemStateProps & BacklogItemPlanningItemDispatchProps;

export const BacklogItemPlanningItem: React.FC<BacklogItemPlanningItemProps> = (props) => {
    const dispatch = useDispatch();
    if (!props.hidden && props.editMode === EditMode.Edit && (!props.saved || props.editing)) {
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
                    friendlyId={props.friendlyId}
                    externalId={props.externalId}
                    editing
                    estimate={props.estimate}
                    rolePhrase={props.rolePhrase}
                    storyPhrase={props.storyPhrase}
                    reasonPhrase={props.reasonPhrase}
                    acceptanceCriteria={props.acceptanceCriteria}
                    startedAt={props.startedAt}
                    finishedAt={props.finishedAt}
                    acceptedAt={props.acceptedAt}
                    releasedAt={props.releasedAt}
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
        const itemEventHandlers: ItemMenuEventHandlers = {
            handleEvent: (eventName: string, itemId: string) => {
                if (eventName === "onEditItemClick") {
                    dispatch(editBacklogItem(props.id));
                } else if (eventName === "onRemoveItemClick") {
                    dispatch(apiDeleteBacklogItem(props.id));
                } else {
                    throw Error(`${eventName} is not handled`);
                }
            }
        };
        return (
            <>
                <SimpleDivider key={`divider-saved-${props.id}`} hidden={props.hidden} highlighted={props.highlightAbove} />
                <BacklogItemCard
                    buildItemMenu={productBacklogItemMenuBuilder(itemEventHandlers)}
                    estimate={props.estimate}
                    hasDetails={props.editMode === EditMode.Edit}
                    hidden={props.hidden}
                    internalId={`${props.id}`}
                    isDraggable={props.editMode === EditMode.Edit}
                    isSelectable={props.editMode === EditMode.Edit}
                    itemId={buildBacklogDisplayId(props.externalId, props.friendlyId)}
                    itemType={props.type === "story" ? BacklogItemTypeEnum.Story : BacklogItemTypeEnum.Bug}
                    key={props.id}
                    marginBelowItem
                    pushState={props.pushState}
                    reasonText={props.reasonPhrase}
                    renderMobile={props.renderMobile}
                    roleText={props.rolePhrase}
                    showDetailMenu={props.showDetailMenu}
                    status={props.status}
                    titleText={props.storyPhrase}
                    onDetailClick={() => {
                        dispatch(backlogItemDetailClick(props.id));
                    }}
                    onCheckboxChange={(checked) => {
                        if (checked) {
                            dispatch(selectProductBacklogItem(props.id));
                        } else {
                            dispatch(unselectProductBacklogItem(props.id));
                        }
                    }}
                    onBacklogItemIdClick={(itemId) => {
                        dispatch(backlogItemIdClick(itemId));
                    }}
                />
            </>
        );
    }
};
