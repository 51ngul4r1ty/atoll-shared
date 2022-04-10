export type ItemMenuEventHandler = {
    (eventName: string, itemId: string): void;
};

export type ItemMenuEventSupportedCheck = {
    (eventName?: string): boolean;
};

export type ItemMenuEventWaitingCheck = {
    (eventName?: string): boolean;
};

export interface ItemMenuEventHandlers {
    handleEvent: ItemMenuEventHandler;
    isEventSupported?: ItemMenuEventSupportedCheck;
    isEventHandlerWaiting?: ItemMenuEventWaitingCheck;
}

/**
 * Builds an "item detail menu" for the item uniquely identified by itemId.
 * The arguments passed in should be self-explanatory except perhaps
 * busyButtonName which is used to determine which of the menu items is
 * busy.  If none of the operations is time-consuming this may not be relevant
 * for this menu.
 */
export type ItemMenuBuilder = (itemId: string, showMenuToLeft: boolean) => React.ReactElement<any, any>;
