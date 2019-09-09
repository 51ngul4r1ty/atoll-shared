import * as React from "react";
import * as i18next from "i18next";
import { withRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { connect } from "react-redux";
import { getLocale } from "../store/app/selectors";

import deDE from "./locales/de_DE/translation.json";
import enUS from "./locales/en_US/translation.json";

const { useEffect } = React;

i18next.init({
    fallbackLng: ["en_US", "de_DE"],
    fallbackNS: ["translation"],
    resources: {
        de_DE: { translation: deDE },
        en_US: { translation: enUS }
    },
    parseMissingKeyHandler: (missing) => {
        if (process.env.NODE_ENV === "development") {
            console.warn("MISSING TRANSLATION:", missing);
        }
        return missing;
    }
});

// NOTE: This didn't work with TypeScript ("Error: Illegal reassignment to import 'i18next'") so used fallbackLng instead
// (i18next as any).languages = ["de_DE", "en_US"];

type Props = {
    children: React.ReactNode;
    locale: "en_US" | "de_DE";
};

const I18N = ({ children, locale }: Props) => {
    useEffect(() => {
        i18next.changeLanguage(locale);
    }, [locale]);

    return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
};

const mapStateToProps = (state: any) => ({
    locale: getLocale(state)
});

export default withRouter<any, any>(
    connect(
        mapStateToProps,
        null,
        null,
        { pure: false }
    )(React.memo(I18N))
);
