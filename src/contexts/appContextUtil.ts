import * as React from "react";

const defaultValue = { state: { isMobile: false }, updateIsMobile: (value: boolean) => {} };
export const AppContext = React.createContext(defaultValue);
export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
