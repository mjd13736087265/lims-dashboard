export type CalendarViewMode = 'month' | 'week';
export type CalendarDimension = 'workgroup' | 'project' | 'area';

// Cross-day interval task model
export interface CalendarTask {
  id: string;
  taskNo: string;
  taskName: string;
  projectId: string;
  projectName: string;
  projectNo: string;
  clientName: string;
  city: string;
  district: string;
  detectCategory: string;
  pointName: string;
  status: string;
  workGroup: string;
  workGroupLeader: string;
  workGroupMembers: string[];
  startDate: string;
  endDate: string;
  sampleNo: string;
}

export interface DayCellData {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: CalendarTask[]; // tasks whose [startDate, endDate] includes this date
  workGroupCount: number;
  projectCount: number;
  areaCount: number;
  statusCounts: Record<string, number>;
  // Cross-day visual indicators
  crossDayTasks: {
    task: CalendarTask;
    isStart: boolean;  // is this the start day of the interval
    isEnd: boolean;    // is this the end day of the interval
    isMiddle: boolean; // is this in the middle of the interval
  }[];
}

export const DIMENSION_CONFIG: Record<CalendarDimension, { label: string; icon: string }> = {
  workgroup: { label: '工作组', icon: 'users' },
  project: { label: '项目', icon: 'folder' },
  area: { label: '区域', icon: 'map-pin' },
};
