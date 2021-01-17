// externals
import React from "react";
import { buildClassName } from "../../../utils/classNameBuilder";

// utils
import { addDays } from "../../../utils/dateHelper";

// style
import css from "./CalendarPanel.module.css";

export interface CalendarPanelStateProps {
    className?: string;
}

export interface CalendarPanelDispatchProps {}

export type CalendarPanelProps = CalendarPanelStateProps & CalendarPanelDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface CalendarPanelInnerStateProps {}

const DAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const InnerCalendarPanel: React.FC<CalendarPanelProps & CalendarPanelInnerStateProps> = (props) => {
    const calendarCells = [];
    const calendarHeaderRow = [];
    const calendarGrid = [];
    calendarGrid.push(calendarHeaderRow);
    let currentMonth = 0;
    let day = new Date(2020, 11, 29, 12, 0, 0, 0);
    for (let row = 0; row < 5; row++) {
        const calendarGridRow = [];
        calendarGrid.push(calendarGridRow);
        for (let col = 0; col < 7; col++) {
            if (row === 0) {
                calendarHeaderRow.push(
                    <div className={css.dayHeader} key={col}>
                        <div className={css.text}>{DAY[day.getDay()]}</div>
                    </div>
                );
            }
            const isCurrentMonth = day.getMonth() === currentMonth;
            const currentMonthClass = isCurrentMonth ? css.currentMonth : null;
            const classToUse = buildClassName(css.day, currentMonthClass);
            calendarGridRow.push(
                <div className={classToUse} key={`${row},${col}`}>
                    <div className={css.text}>{day.getDate()}</div>
                </div>
            );
            day = addDays(day, 1);
        }
    }

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            calendarCells.push(calendarGrid[row][col]);
        }
    }
    return (
        <div className={props.className}>
            <div>
                <div>2021</div>
                <div>January</div>
                <div>&lt;</div>
                <div>&gt;</div>
            </div>
            <div className={css.calendar}>{calendarCells}</div>
        </div>
    );
};

export const CalendarPanel = (props: CalendarPanelProps) => <InnerCalendarPanel {...props} />;
