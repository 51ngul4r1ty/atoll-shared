import * as React from "react";

// let contextValue: any;

// export const setValue = (newValue: any) => {
//     setAppContextValue(newValue);
// };

// export const getValue = () => {
//     return contextValue.value;
// };

// export const setAppContextValue = (newValue: any) => {
//     if (contextValue && contextValue.value === newValue) {
//         console.log("value is the same");
//         return contextValue;
//     }
//     console.log("value has changed");
//     contextValue = { ...contextValue, value: newValue, setValue, getValue };
//     return contextValue;
// };

// export const setAppContextValue = (self: any, newValue: any) => {
//     return {
//         state:
//     }
// }

// contextValue = setAppContextValue({ mobile: false });

const defaultValue = { state: { isMobile: false }, updateIsMobile: (value: boolean) => {} };
export const AppContext = React.createContext(defaultValue);
export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
