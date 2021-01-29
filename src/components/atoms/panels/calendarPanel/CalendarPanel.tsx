// externals
import React, { useEffect, useState } from "react";

// style
import css from "./CalendarPanel.module.css";

// utils
import { monthToString } from "../../../../utils/dateHelper";
import { buildClassName } from "../../../../utils/classNameBuilder";
import {
    calcCurrentMonth,
    calcFirstDayToShow,
    calcMonthToShow,
    calcYearToShow,
    getSprint,
    getStartingSprintIdx,
    inSprintRange,
    isFirstDay,
    isLastDay,
    sortSprints
} from "./calendarPanelUtils";

// interfaces/types
import { CalendarSprintRange } from "./calendarSprintTypes";
import { PropsWithClassName } from "../../../common/types";
import { DateOnly } from "../../../../types/dateTypes";

export interface CalendarPanelStateProps extends PropsWithClassName {
    dateSelected?: DateOnly | null;
    sprints?: CalendarSprintRange[];
}

export interface CalendarPanelDispatchProps {
    onDateClick?: { (date: DateOnly): void };
}

export type CalendarPanelProps = CalendarPanelStateProps & CalendarPanelDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface CalendarPanelInnerStateProps {}

const CALENDAR_CELL_COUNT = 5 * 7;

const DAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const InnerCalendarPanel: React.FC<CalendarPanelProps & CalendarPanelInnerStateProps> = (props) => {
    const dates = props.dateSelected ? [props.dateSelected] : [new DateOnly()];
    const [year, setYear] = useState(calcYearToShow(dates));
    const [month, setMonth] = useState(calcMonthToShow(dates));
    const [firstDay, setFirstDay] = useState(calcFirstDayToShow(dates));
    let day = firstDay;
    const monthName = monthToString(month, 1);
    const calendarCells = [];
    const calendarHeaderRow = [];
    const calendarGrid = [];
    const sprintsSorted = sortSprints(props.sprints);
    calendarGrid.push(calendarHeaderRow);
    let currentMonth = calcCurrentMonth(dates);
    let sprintIdx = getStartingSprintIdx(sprintsSorted, day);
    let sprint = sprintIdx === -1 ? null : sprintsSorted[sprintIdx];
    let inCurrentSprintRange = inSprintRange(sprint, day);
    let wasInSprintRange = inCurrentSprintRange;
    for (let row = 0; row < 5; row++) {
        const calendarGridRow = [];
        calendarGrid.push(calendarGridRow);
        for (let col = 0; col < 7; col++) {
            if (row === 0) {
                calendarHeaderRow.push(
                    <div className={css.dayHeader} key={col}>
                        <div className={css.text}>{DAY[day.getDayOfWeek()]}</div>
                    </div>
                );
            }
            const isCurrentMonth = day.getMonth() === currentMonth;
            const isSelectedDate = day.eq(props.dateSelected);
            const currentMonthClass = isCurrentMonth ? css.currentMonth : null;
            const selectedDateClass = isSelectedDate ? css.selected : null;
            inCurrentSprintRange = inSprintRange(sprint, day);
            if (wasInSprintRange && !inCurrentSprintRange) {
                sprintIdx++;
                sprint = getSprint(sprintsSorted, sprintIdx);
                inCurrentSprintRange = inSprintRange(sprint, day);
            }
            wasInSprintRange = inCurrentSprintRange;

            const classToUse = buildClassName(
                css.day,
                currentMonthClass,
                selectedDateClass,
                inCurrentSprintRange ? css.sprint : null,
                inCurrentSprintRange && sprint?.editing ? css.editing : null,
                inCurrentSprintRange && isFirstDay(sprint, day) ? css.start : null,
                inCurrentSprintRange && isLastDay(sprint, day) ? css.finish : null
            );
            calendarGridRow.push(
                <div data-value={day.toISODate()} className={classToUse} key={`${row},${col}`}>
                    <div className={css.text}>{day.getDay()}</div>
                </div>
            );
            day = day.addDays(1);
        }
    }

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            calendarCells.push(calendarGrid[row][col]);
        }
    }
    const handleDayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const parentElt = target.parentElement;
        if (parentElt) {
            const rawDataValue = parentElt.getAttribute("data-value");
            const dataValue = DateOnly.fromISODate(rawDataValue);
            if (props.onDateClick && dataValue) {
                props.onDateClick(dataValue);
            }
        }
    };
    const handlePrevClick = () => {
        if (month > 1) {
            setMonth(month - 1);
        } else {
            setYear(year - 1);
            setMonth(12);
        }
        setFirstDay(firstDay.addDays(-CALENDAR_CELL_COUNT));
    };
    const handleNextClick = () => {
        if (month < 12) {
            setMonth(month + 1);
        } else {
            setYear(year + 1);
            setMonth(1);
        }
        setFirstDay(firstDay.addDays(CALENDAR_CELL_COUNT));
    };

    return (
        <div className={props.className}>
            <div className={css.header}>
                <div className={css.cell}>{year}</div>
                <div className={css.cell}>{monthName}</div>
                <div
                    className={buildClassName(css.cell, css.clickable)}
                    onClick={() => {
                        handlePrevClick();
                    }}
                >
                    &lt;
                </div>
                <div
                    className={buildClassName(css.cell, css.clickable)}
                    onClick={() => {
                        handleNextClick();
                    }}
                >
                    &gt;
                </div>
            </div>
            <div className={css.calendar} onClick={(e) => handleDayClick(e)}>
                {calendarCells}
            </div>
        </div>
    );
};

export const CalendarPanel = (props: CalendarPanelProps) => <InnerCalendarPanel {...props} />;
