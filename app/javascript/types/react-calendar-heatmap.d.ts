declare module 'react-calendar-heatmap' {
  import { Component } from 'react';

  export interface CalendarHeatmapValue {
    date: Date | string;
    count: number;
    [key: string]: any;
  }

  export interface TooltipDataAttrs {
    [key: string]: string;
  }

  export interface CalendarHeatmapProps {
    values: CalendarHeatmapValue[];
    startDate?: Date;
    endDate?: Date;
    gutterSize?: number;
    horizontal?: boolean;
    showMonthLabels?: boolean;
    showWeekdayLabels?: boolean;
    showOutOfRangeDays?: boolean;
    tooltipDataAttrs?: TooltipDataAttrs | ((value: CalendarHeatmapValue | null) => TooltipDataAttrs);
    titleForValue?: (value: CalendarHeatmapValue | null) => string;
    classForValue?: (value: CalendarHeatmapValue | null) => string;
    onClick?: (value: CalendarHeatmapValue | null) => void;
    onMouseOver?: (event: React.MouseEvent<SVGElement>, value: CalendarHeatmapValue | null) => void;
    onMouseLeave?: (event: React.MouseEvent<SVGElement>, value: CalendarHeatmapValue | null) => void;
    transformDayElement?: (element: React.ReactElement, value: CalendarHeatmapValue | null, index: number) => React.ReactElement;
  }

  export default class CalendarHeatmap extends Component<CalendarHeatmapProps> {}
}