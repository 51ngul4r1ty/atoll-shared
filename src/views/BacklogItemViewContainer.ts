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
    getCurrentBacklogItemEstimate,
    getCurrentBacklogItemExternalId,
    getCurrentBacklogItemFriendlyId,
    getCurrentBacklogItemId,
    getCurrentBacklogItemReasonPhrase,
    getCurrentBacklogItemRolePhrase,
    getCurrentBacklogItemSaved,
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
    let result: BacklogItemViewStateProps = {
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
        type: getCurrentBacklogItemType(state),
        projectDisplayId: ownProps.match.params.projectDisplayId,
        backlogItemDisplayId: ownProps.match.params.backlogItemDisplayId
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
