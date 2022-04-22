// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { BacklogItemView, BacklogItemViewDispatchProps, BacklogItemViewStateProps } from "./BacklogItemView";
import { StateTree } from "../reducers/rootReducer";

// utils
import { isPlatformWindows } from "../utils/osUtils";

// selectors
import * as backlogItemSelectors from "../selectors/backlogItemSelectors";
import * as backlogItemPartSelectors from "../selectors/backlogItemPartSelectors";
import * as appSelectors from "../selectors/appSelectors";

// actions
import { apiBffViewsBacklogItem } from "../actions/apiBffViewsBacklogItem";

export interface BacklogItemViewContainerOwnProps {
    match: {
        params: {
            projectDisplayId: string;
            backlogItemDisplayId: string;
        };
    };
}

const mapStateToProps = (state: StateTree, ownProps: BacklogItemViewContainerOwnProps): BacklogItemViewStateProps => {
    const result: BacklogItemViewStateProps = {
        acceptanceCriteria: backlogItemSelectors.getCurrentBacklogItemAcceptanceCriteria(state),
        acceptedAt: backlogItemSelectors.getCurrentBacklogItemAcceptedAt(state),
        backlogItemDisplayId: ownProps.match.params.backlogItemDisplayId,
        editMode: appSelectors.getAppEditMode(state),
        electronClient: appSelectors.getElectronClient(state),
        estimate: backlogItemSelectors.getCurrentBacklogItemEstimate(state),
        externalId: backlogItemSelectors.getCurrentBacklogItemExternalId(state),
        finishedAt: backlogItemSelectors.getCurrentBacklogItemFinishedAt(state),
        friendlyId: backlogItemSelectors.getCurrentBacklogItemFriendlyId(state),
        id: backlogItemSelectors.getCurrentBacklogItemId(state),
        openedDetailMenuBacklogItemPartId: backlogItemPartSelectors.getOpenedDetailMenuBacklogItemPartId(state),
        parts: backlogItemPartSelectors.getCurrentBacklogItemParts(state),
        projectDisplayId: ownProps.match.params.projectDisplayId,
        reasonPhrase: backlogItemSelectors.getCurrentBacklogItemReasonPhrase(state),
        releasedAt: backlogItemSelectors.getCurrentBacklogItemReleasedAt(state),
        rolePhrase: backlogItemSelectors.getCurrentBacklogItemRolePhrase(state),
        saved: backlogItemSelectors.getCurrentBacklogItemSaved(state),
        showWindowTitleBar: !isPlatformWindows(),
        startedAt: backlogItemSelectors.getCurrentBacklogItemStartedAt(state),
        storyPhrase: backlogItemSelectors.getCurrentBacklogItemStoryPhrase(state),
        type: backlogItemSelectors.getCurrentBacklogItemType(state),
        strictMode: appSelectors.isStrictMode(state)
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
