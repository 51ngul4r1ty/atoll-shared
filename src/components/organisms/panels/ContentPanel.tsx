// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./ContentPanel.module.css";

/* exported types */

export type ContentPanelStateProps = {};

export type ContentPanelDispatchProps = {};

export type ContentPanelProps = ContentPanelStateProps & ContentPanelDispatchProps & WithTranslation;

/* exported components */

export const InnerContentPanel: React.FC<ContentPanelProps> = (props) => <div className={css.contentPanel}>{props.children}</div>;

export const ContentPanel = withTranslation()(InnerContentPanel);
