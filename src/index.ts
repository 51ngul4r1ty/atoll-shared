export { App } from "./App";
export { default as AppContainer } from "./AppContainer";
export { configureStore } from "./store";
// TODO: Get rid of IntlProvider- giving me too many problems!!!!
// export { default as IntlProvider } from "./i18n/IntlProvider";
import { MainLayout } from "./layouts/MainLayout";
export { default as createHistory } from "./store/history";

export const layouts = {
    MainLayout
};
