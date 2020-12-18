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

const mapStateToProps = (state: StateTree): BacklogItemViewStateProps => {
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
        type: getCurrentBacklogItemType(state)
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): BacklogItemViewDispatchProps => {
    return {};
};

// const AppContainer = withRouter(
//     connect(
//         mapStateToProps,
//         mapDispatchToProps
//     )(App)
// ); // withTranslation()<any>(App));

export const BacklogItemViewContainer = connect(mapStateToProps, mapDispatchToProps)(BacklogItemView);
