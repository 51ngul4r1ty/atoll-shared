// externals
import * as React from "react";

// libraries
import { themeList } from "../themes/all";

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
    storeLastThemeName(themeName: string) {
        this.lastThemeName = themeName;
    }
    render() {
        return <div className="app-layout">{this.props.children}</div>;
    }
}
