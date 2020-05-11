import { buildActionName } from "./utils/apiActionUtils";
import * as Names from "./apiActionNames";

export const SET_LOCALE = "app/set-locale";
export const SET_EDIT_MODE = "app/set-edit-mode";

export const API_GET_BACKLOG_ITEMS_REQUEST = buildActionName(Names.GET_BACKLOG_ITEMS, "request");
export const API_GET_BACKLOG_ITEMS_SUCCESS = buildActionName(Names.GET_BACKLOG_ITEMS, "success");
export const API_GET_BACKLOG_ITEMS_FAILURE = buildActionName(Names.GET_BACKLOG_ITEMS, "failure");

export const API_GET_USER_PREFS_REQUEST = buildActionName(Names.GET_USER_PREFS, "request");
export const API_GET_USER_PREFS_SUCCESS = buildActionName(Names.GET_USER_PREFS, "success");
export const API_GET_USER_PREFS_FAILURE = buildActionName(Names.GET_USER_PREFS, "failure");

export const API_POST_BACKLOG_ITEM_REQUEST = buildActionName(Names.POST_BACKLOG_ITEM, "request");
export const API_POST_BACKLOG_ITEM_SUCCESS = buildActionName(Names.POST_BACKLOG_ITEM, "success");
export const API_POST_BACKLOG_ITEM_FAILURE = buildActionName(Names.POST_BACKLOG_ITEM, "failure");

export const API_POST_ACTION_REORDER_BACKLOG_ITEM_REQUEST = buildActionName(Names.POST_ACTION_REORDER_BACKLOG_ITEM, "request");
export const API_POST_ACTION_REORDER_BACKLOG_ITEM_SUCCESS = buildActionName(Names.POST_ACTION_REORDER_BACKLOG_ITEM, "success");
export const API_POST_ACTION_REORDER_BACKLOG_ITEM_FAILURE = buildActionName(Names.POST_ACTION_REORDER_BACKLOG_ITEM, "failure");

export const API_POST_ACTION_LOGIN_REQUEST = buildActionName(Names.POST_ACTION_LOGIN, "request");
export const API_POST_ACTION_LOGIN_SUCCESS = buildActionName(Names.POST_ACTION_LOGIN, "success");
export const API_POST_ACTION_LOGIN_FAILURE = buildActionName(Names.POST_ACTION_LOGIN, "failure");

export const API_POST_ACTION_RETRY_TOKEN_REQUEST = buildActionName(Names.POST_ACTION_REFRESH_TOKEN, "request");
export const API_POST_ACTION_RETRY_TOKEN_SUCCESS = buildActionName(Names.POST_ACTION_REFRESH_TOKEN, "success");
export const API_POST_ACTION_RETRY_TOKEN_FAILURE = buildActionName(Names.POST_ACTION_REFRESH_TOKEN, "failure");

export const ROUTE_PLAN_VIEW = "app/route:plan-view";
export const ROUTE_SPRINT_VIEW = "app/route:sprint-view";
export const ROUTE_REVIEW_VIEW = "app/route:review-view";

export const ADD_BACKLOG_ITEM = "app/add:backlog-item";
export const SAVE_BACKLOG_ITEM = "app/save:backlog-item";
export const CANCEL_UNSAVED_BACKLOG_ITEM = "app/cancel-unsaved:backlog-item";

export const UPDATE_BACKLOG_ITEM_FIELDS = "app/update:user-story-fields";

export const RECEIVE_WEBSOCKET_MESSAGE = "app/ws:receive-message";

export const RECEIVE_PUSHED_BACKLOG_ITEM = "app/receive:pushed-backlog-item";

export const REORDER_BACKLOG_ITEM = "app/reorder:backlog-item";

export const TOGGLE_BACKLOG_ITEM_DETAIL = "app/toggle:backlog-item-detail";

export const SET_USERNAME = "app/user:set-username";
export const SET_PASSWORD = "app/user:set-password";

export const LOGIN_USER = "app/user:login-user";
