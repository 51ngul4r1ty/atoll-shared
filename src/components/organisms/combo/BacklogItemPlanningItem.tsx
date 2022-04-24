// externals
import * as React from "react";
import { useDispatch } from "react-redux";

// interfaces/types
import type { BacklogItemWithSource } from "../../../reducers/backlogItems/backlogItemsReducerTypes";
import type { ItemMenuEventHandlers } from "../../molecules/menus/menuBuilderTypes";

// consts/enums
import { EditMode } from "../../common/componentEnums";

// actions
import { apiDeleteBacklogItem, apiJoinUnallocatedBacklogItemParts } from "../../../actions/apiBacklogItems";
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

// components
import { SimpleDivider } from "../../atoms/dividers/SimpleDivider";
import { BacklogItemDetailForm } from "../forms/BacklogItemDetailForm";
import { BacklogItemCard, BacklogItemCardType, BacklogItemTypeEnum } from "../../molecules/cards/BacklogItemCard";

// style
import css from "./BacklogItemPlanningItem.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { buildBacklogDisplayId } from "../../../utils/backlogItemHelper";
import { productBacklogItemMenuBuilder } from "../../common/itemMenuBuilders";
import { computeProductBacklogItemEstimate } from "../panels/productPlanning/productPlanningPanelUtils";

export interface BacklogItemPlanningItemStateProps extends BacklogItemWithSource {
    busyJoiningUnallocatedParts: boolean;
    busySplittingStory: boolean;
    saving: boolean;
    editMode: EditMode;
    hidden?: boolean;
    highlightAbove: boolean;
    renderMobile: boolean;
    showDetailMenu: boolean;
    strictMode: boolean;
    suppressTopPadding: boolean;
}

export interface BacklogItemPlanningItemDispatchProps {}

export type BacklogItemPlanningItemProps = BacklogItemPlanningItemStateProps & BacklogItemPlanningItemDispatchProps;

const InternalBacklogItemPlanningItem: React.FC<BacklogItemPlanningItemProps> = (props) => {
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
                    acceptanceCriteria={props.acceptanceCriteria}
                    acceptedAt={props.acceptedAt}
                    className={classNameToUse}
                    editing
                    estimate={props.estimate}
                    externalId={props.externalId}
                    finishedAt={props.finishedAt}
                    friendlyId={props.friendlyId}
                    id={props.id}
                    instanceId={props.instanceId}
                    reasonPhrase={props.reasonPhrase}
                    releasedAt={props.releasedAt}
                    renderMobile={props.renderMobile}
                    rolePhrase={props.rolePhrase}
                    startedAt={props.startedAt}
                    storyPhrase={props.storyPhrase}
                    type={props.type}
                    status={props.status}
                    saving={props.saving}
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
                } else if (eventName === "onJoinItemClick") {
                    dispatch(apiJoinUnallocatedBacklogItemParts(props.id));
                } else {
                    throw Error(`${eventName} is not handled`);
                }
            },
            isEventHandlerWaiting: (eventName: string) => eventName === "onJoinItemClick" && props.busyJoiningUnallocatedParts,
            isEventSupported: (eventName: string) => (eventName === "onJoinItemClick" ? props.unallocatedParts > 1 : true)
        };
        return (
            <>
                <SimpleDivider key={`divider-saved-${props.id}`} hidden={props.hidden} highlighted={props.highlightAbove} />
                <BacklogItemCard
                    buildItemMenu={productBacklogItemMenuBuilder(itemEventHandlers)}
                    cardType={BacklogItemCardType.ProductBacklogCard}
                    estimate={computeProductBacklogItemEstimate(props.estimate, props.unallocatedPoints)}
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
                    storyEstimate={props.storyEstimate}
                    titleText={props.storyPhrase}
                    totalParts={props.totalParts}
                    unallocatedParts={props.unallocatedParts}
                    onDetailClick={() => {
                        dispatch(backlogItemDetailClick(props.id, props.strictMode));
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

export const BacklogItemPlanningItem = React.memo(InternalBacklogItemPlanningItem);
