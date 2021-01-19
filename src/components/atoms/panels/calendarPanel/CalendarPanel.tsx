// externals
import React from "react";

// style
import css from "./CalendarPanel.module.css";

// utils
import { addDays, sameDay } from "../../../../utils/dateHelper";
import { buildClassName } from "../../../../utils/classNameBuilder";
import { getSprint, getStartingSprintIdx, inSprintRange, isFirstDay, isLastDay, sortSprints } from "./calendarPanelUtils";

// interfaces/types
import { CalendarSprintRange } from "./calendarSprintTypes";

export interface CalendarPanelStateProps {
    className?: string;
    dateSelected?: Date | null;
    sprints?: CalendarSprintRange[];
}

export interface CalendarPanelDispatchProps {
    onDateClick?: { (date: Date): void };
}

export type CalendarPanelProps = CalendarPanelStateProps & CalendarPanelDispatchProps;

// NOTE: Keep this private so that it isn't referenced outside this component
interface CalendarPanelInnerStateProps {}

const DAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const InnerCalendarPanel: React.FC<CalendarPanelProps & CalendarPanelInnerStateProps> = (props) => {
    const calendarCells = [];
    const calendarHeaderRow = [];
    const calendarGrid = [];
    const sprintsSorted = sortSprints(props.sprints);
    calendarGrid.push(calendarHeaderRow);
    let currentMonth = 0;
    let day = new Date(2020, 11, 29, 12, 0, 0, 0);
    let sprintIdx = getStartingSprintIdx(sprintsSorted, day);
    let inCurrentSprintRange = sprintIdx >= 0;
    let wasInSprintRange = sprintIdx >= 0;
    for (let row = 0; row < 5; row++) {
        let sprint = sprintIdx === -1 ? null : sprintsSorted[sprintIdx];
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
            const isSelectedDate = sameDay(day, props.dateSelected);
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
                <div data-value={day} className={classToUse} key={`${row},${col}`}>
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
    const handleDayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const parentElt = target.parentElement;
        if (parentElt) {
            const dataValue = parentElt.getAttribute("data-value");
            if (props.onDateClick && dataValue) {
                props.onDateClick(new Date(Date.parse(dataValue)));
            }
        }
    };
    return (
        <div className={props.className}>
            <div className={css.header}>
                <div className={css.cell}>2021</div>
                <div className={css.cell}>January</div>
                <div className={css.cell}>&lt;</div>
                <div className={css.cell}>&gt;</div>
            </div>
            <div className={css.calendar} onClick={(e) => handleDayClick(e)}>
                {calendarCells}
            </div>
        </div>
    );
};

export const CalendarPanel = (props: CalendarPanelProps) => <InnerCalendarPanel {...props} />;
