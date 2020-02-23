// externals
import * as React from "react";

// libraries
import { themeList } from "../themes/all";

// style
import css from "./MainLayout.module.css";

/* executed on initialization only */

/* exported component */

export class MainLayout extends React.Component<{}, {}> {
    private lastThemeName: string;
    constructor(props) {
        super(props);
        this.lastThemeName = null;
    }
    componentDidMount() {
        window.addEventListener("load", () => {
            this.themeEngineSetup();
        });
    }
    getThemeAttribute() {
        const prefix = "theme-";
        let result = null;
        let html = document.querySelector("html");
        html.classList.forEach((item) => {
            if (item.indexOf(prefix) === 0) {
                const themeName = item.substr(prefix.length);
                result = themeName;
            }
        });
        if (!result) {
            result = "default";
        }
        return result;
    }
    setThemeAttribute(fullThemeName: string) {
        const prefix = "theme-";
        let result = null;
        let html = document.querySelector("html");
        const themesToRemove = [];
        html.classList.forEach((item) => {
            if (item.indexOf(prefix) === 0) {
                themesToRemove.push(item);
            }
        });
        if (themesToRemove.indexOf(fullThemeName) < 0) {
            html.classList.add(fullThemeName);
        }
        themesToRemove.forEach((theme) => {
            if (theme !== fullThemeName) {
                html.classList.remove(theme);
            }
        });
        return result;
    }
    setThemeVars(themeName) {
        switch (themeName) {
            case "default":
            case "dark": {
                this.addBodyStylesForTheme(themeName);
                break;
            }
            default: {
                break;
            }
        }
    }
    addBodyStylesForTheme(themeName) {
        const bodyStyles = document.body.style;
        const theme = this.getTheme(themeName);
        for (var propName in theme) {
            var propValue = theme[propName];
            bodyStyles.setProperty(propName, propValue);
        }
    }
    getTheme(themeName) {
        var items = themeList.filter((item) => item.name === themeName);
        if (items.length) {
            return items[0] && items[0].theme;
        } else {
            return null;
        }
    }
    themeEngineSetup() {
        const themeName = this.getThemeAttribute();
        this.setThemeVars(themeName);
        this.setupNextCheck();
    }
    setupNextCheck() {
        setTimeout(() => {
            this.checkForBrowserDarkMode();
            this.checkForThemeChange();
        }, 500);
    }
    checkForThemeChange() {
        const themeName = this.getThemeAttribute();
        if (themeName !== this.lastThemeName) {
            this.setThemeVars(themeName);
            this.storeLastThemeName(themeName);
        }
        this.setupNextCheck();
    }
    checkForBrowserDarkMode() {
        if (matchMedia("(prefers-color-scheme: dark)").matches) {
            this.setThemeAttribute("theme-dark");
        }
        if (matchMedia("(prefers-color-scheme: light)").matches) {
            this.setThemeAttribute("theme-default");
        }
    }
    storeLastThemeName(themeName: string) {
        this.lastThemeName = themeName;
    }
    render() {
        return <div className={`app-layout ${css.fullPage}`}>{this.props.children}</div>;
    }
}
