// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { BacklogItemView, BacklogItemViewDispatchProps, BacklogItemViewStateProps } from "./BacklogItemView";
import { StateTree } from "../reducers/rootReducer";

// utils
import { isPlatformWindows } from "../utils/osUtils";

// selectors
import {
    getCurrentBacklogItemAcceptanceCriteria,
    getCurrentBacklogItemAcceptedAt,
    getCurrentBacklogItemEstimate,
    getCurrentBacklogItemExternalId,
    getCurrentBacklogItemFinishedAt,
    getCurrentBacklogItemFriendlyId,
    getCurrentBacklogItemId,
    getCurrentBacklogItemParts,
    getCurrentBacklogItemReasonPhrase,
    getCurrentBacklogItemReleasedAt,
    getCurrentBacklogItemRolePhrase,
    getCurrentBacklogItemSaved,
    getCurrentBacklogItemStartedAt,
    getCurrentBacklogItemStoryPhrase,
    getCurrentBacklogItemType
} from "../selectors/backlogItemSelectors";
import { getAppEditMode, getElectronClient } from "../selectors/appSelectors";
import { apiBffViewsBacklogItem } from "../actions/apiBffViewsBacklogItem";

// BUSY: This isn't working... OwnProps not passing in route params
export interface BacklogItemViewContainerOwnProps {
    match: {
        params: {
            projectDisplayId: string;
            backlogItemDisplayId: string;
        };
    };
}

const mapStateToProps = (state: StateTree, ownProps: BacklogItemViewContainerOwnProps): BacklogItemViewStateProps => {
    const splits = getCurrentBacklogItemParts(state).map((part) => ({
        allocatedToSprintId: null,
        allocatedToSprintName: null,
        plannedPoints: part.points,
        partId: part.id,
        percentage: part.percentage,
        startedAt: part.startedAt,
        finishedAt: part.finishedAt,
        status: part.status,
        expanded: true
    }));
    let result: BacklogItemViewStateProps = {
        acceptanceCriteria: getCurrentBacklogItemAcceptanceCriteria(state),
        editMode: getAppEditMode(state),
        electronClient: getElectronClient(state),
        showWindowTitleBar: !isPlatformWindows(),
        id: getCurrentBacklogItemId(state),
        friendlyId: getCurrentBacklogItemFriendlyId(state),
        externalId: getCurrentBacklogItemExternalId(state),
        saved: getCurrentBacklogItemSaved(state),
        estimate: getCurrentBacklogItemEstimate(state),
        rolePhrase: getCurrentBacklogItemRolePhrase(state),
        storyPhrase: getCurrentBacklogItemStoryPhrase(state),
        reasonPhrase: getCurrentBacklogItemReasonPhrase(state),
        startedAt: getCurrentBacklogItemStartedAt(state),
        finishedAt: getCurrentBacklogItemFinishedAt(state),
        acceptedAt: getCurrentBacklogItemAcceptedAt(state),
        releasedAt: getCurrentBacklogItemReleasedAt(state),
        type: getCurrentBacklogItemType(state),
        projectDisplayId: ownProps.match.params.projectDisplayId,
        backlogItemDisplayId: ownProps.match.params.backlogItemDisplayId,
        // TODO: Rename this property to parts?
        splits
        // TODO: Get this from state
        // splits: [
        // {
        //     assignedSprintName: "Sprint 242"
        // },
        // {
        //     assignedSprintName: "Sprint 242"
        // },
        // {
        //     assignedSprintName: null
        // }
        // ]
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): BacklogItemViewDispatchProps => {
    return {
        onLoaded: (projectDisplayId: string, backlogItemDisplayId: string) => {
            dispatch(apiBffViewsBacklogItem(projectDisplayId, backlogItemDisplayId));
        }
    };
};

export const BacklogItemViewContainer = connect(mapStateToProps, mapDispatchToProps)(BacklogItemView);
