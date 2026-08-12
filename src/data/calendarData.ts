import type { CalendarTask } from '@/types/calendar';
import { clientAreas } from './mockData';

// Check if a date is within a task's [startDate, endDate] range (inclusive)
export function isDateInRange(dateStr: string, startDate: string, endDate: string): boolean {
  return dateStr >= startDate && dateStr <= endDate;
}

// Generate TASK-level gantt data for June 2026
// Business hierarchy: 合同 → 项目 → 任务 → 点位
// Calendar shows TASK-level bars (sampling managers care about task allocation)
export function generateCalendarTasks(): CalendarTask[] {
  const pseudoRand = (seed: number) => {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  const workGroupDefs: Record<string, { leader: string; members: string[] }> = {
    '王晓王': { leader: '王晓王', members: ['石亮', '刘喜龙'] },
    '张如强': { leader: '张如强', members: ['石亮', '李迪', '刘喜龙'] },
    '王小': { leader: '王小', members: ['石亮', '刘喜龙', 'zzz'] },
    '刘喜龙': { leader: '刘喜龙', members: ['石亮'] },
    '毛金达': { leader: '毛金达', members: ['石亮', '刘喜龙'] },
  };
  const workGroupNames = Object.keys(workGroupDefs);

  // 20 tasks (sampling managers track tasks, not projects)
  const tasks = [
    { id: 't1',  name: '地表水采样任务-01', duration: 3, client: '浙江淘宝网络有限公司' },
    { id: 't2',  name: '环境空气采样任务-02', duration: 4, client: '浙江淘宝网络有限公司' },
    { id: 't3',  name: '土壤采样任务-03', duration: 2, client: '浙江致和信息科技有限公司' },
    { id: 't4',  name: '噪声监测任务-04', duration: 5, client: '浙江致和信息科技有限公司' },
    { id: 't5',  name: '地下水采样任务-05', duration: 3, client: '浙江三洲检测认证有限公司' },
    { id: 't6',  name: '地表水采样任务-06', duration: 6, client: '浙江三洲检测认证有限公司' },
    { id: 't7',  name: '环境空气采样任务-07', duration: 2, client: '宁波均胜电子股份有限公司' },
    { id: 't8',  name: '土壤采样任务-08', duration: 4, client: '宁波均胜电子股份有限公司' },
    { id: 't9',  name: '地下水采样任务-09', duration: 3, client: '新余赣科文化传媒有限公司' },
    { id: 't10', name: '地表水采样任务-10', duration: 5, client: '浙江淘宝网络有限公司' },
    { id: 't11', name: '噪声监测任务-11', duration: 2, client: '浙江致和信息科技有限公司' },
    { id: 't12', name: '环境空气采样任务-12', duration: 4, client: '浙江三洲检测认证有限公司' },
    { id: 't13', name: '土壤采样任务-13', duration: 3, client: '宁波均胜电子股份有限公司' },
    { id: 't14', name: '地下水采样任务-14', duration: 2, client: '浙江淘宝网络有限公司' },
    { id: 't15', name: '地表水采样任务-15', duration: 5, client: '浙江致和信息科技有限公司' },
    { id: 't16', name: '噪声监测任务-16', duration: 3, client: '浙江三洲检测认证有限公司' },
    { id: 't17', name: '环境空气采样任务-17', duration: 4, client: '新余赣科文化传媒有限公司' },
    { id: 't18', name: '土壤采样任务-18', duration: 2, client: '浙江淘宝网络有限公司' },
    { id: 't19', name: '地下水采样任务-19', duration: 3, client: '浙江致和信息科技有限公司' },
    { id: 't20', name: '地表水采样任务-20', duration: 4, client: '宁波均胜电子股份有限公司' },
  ];

  const statusPool = ['待采样', '采样中', '运输中', '已完结'];

  return tasks.map((task, idx) => {
    const wgName = workGroupNames[Math.floor(pseudoRand(idx * 13) * workGroupNames.length)];
    const wgDef = workGroupDefs[wgName];
    const status = statusPool[Math.floor(pseudoRand(idx * 23) * statusPool.length)];

    let startDay: number;
    if (status === '已完结') startDay = 1 + Math.floor(pseudoRand(idx * 41) * 10);
    else if (status === '运输中') startDay = 5 + Math.floor(pseudoRand(idx * 47) * 10);
    else if (status === '采样中') startDay = 8 + Math.floor(pseudoRand(idx * 53) * 8);
    else startDay = 10 + Math.floor(pseudoRand(idx * 59) * 16);

    startDay = Math.max(1, Math.min(26, startDay));
    const endDay = Math.min(30, startDay + task.duration - 1);

    const clientArea = clientAreas.find(ca => ca.clientName === task.client);

    return {
      id: `task${idx}`,
      taskNo: `T${String(idx + 1).padStart(3, '0')}`,
      taskName: task.name,
      projectId: `p${(idx % 5) + 1}`,
      projectName: `项目${(idx % 5) + 1}`,
      projectNo: `J/H2600${(idx % 5) + 1}`,
      clientName: task.client,
      city: clientArea?.city || '杭州市',
      district: clientArea?.district || '西湖区',
      detectCategory: '',
      pointName: '',
      status,
      workGroup: wgName,
      workGroupLeader: wgDef.leader,
      workGroupMembers: wgDef.members,
      startDate: `2026-06-${String(startDay).padStart(2, '0')}`,
      endDate: `2026-06-${String(endDay).padStart(2, '0')}`,
      sampleNo: '',
    };
  });
}

// Get tasks that overlap with a specific date (date is within [startDate, endDate])
export function getTasksForDate(tasks: CalendarTask[], dateStr: string): CalendarTask[] {
  return tasks.filter(t => isDateInRange(dateStr, t.startDate, t.endDate));
}

// Get all dates in a month
export function getMonthDays(year: number, month: number): { date: string; dayOfMonth: number; isCurrentMonth: boolean; isToday: boolean }[] {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDayOfWeek = firstDay.getDay(); // 0=Sunday

  const days: { date: string; dayOfMonth: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    days.push({
      date: `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      dayOfMonth: d,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      date: dateStr,
      dayOfMonth: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Next month padding to fill 6 rows (42 cells)
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    days.push({
      date: `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      dayOfMonth: d,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return days;
}

// Get week dates
export function getWeekDays(year: number, month: number, weekOffset: number): { date: string; dayOfMonth: number; isCurrentMonth: boolean; isToday: boolean; dayName: string }[] {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const firstDay = new Date(year, month - 1, 1);
  const startSunday = new Date(firstDay);
  startSunday.setDate(firstDay.getDate() - firstDay.getDay() + weekOffset * 7);

  const days: { date: string; dayOfMonth: number; isCurrentMonth: boolean; isToday: boolean; dayName: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startSunday);
    d.setDate(startSunday.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    days.push({
      date: dateStr,
      dayOfMonth: d.getDate(),
      isCurrentMonth: d.getMonth() === month - 1,
      isToday: dateStr === todayStr,
      dayName: dayNames[i],
    });
  }

  return days;
}
