import { useState, useMemo, useCallback } from 'react';
import {
  X, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  LayoutGrid, List, Clock, CheckCircle2, Truck, FlaskConical,
  MapPin, Users
} from 'lucide-react';
import type { CalendarViewMode, CalendarTask } from '@/types/calendar';
import { generateCalendarTasks, getTasksForDate } from '@/data/calendarData';

interface SamplingCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  '待采样': <FlaskConical size={10} />,
  '采样中': <Clock size={10} />,
  '运输中': <Truck size={10} />,
  '已完结': <CheckCircle2 size={10} />,
};

const STATUS_COLOR: Record<string, string> = {
  '待采样': '#13C2C2',
  '采样中': '#52C41A',
  '运输中': '#722ED1',
  '已完结': '#52C41A',
};

const STATUS_BG: Record<string, string> = {
  '待采样': 'rgba(34,211,238,0.10)',
  '采样中': 'rgba(34,197,94,0.08)',
  '运输中': 'rgba(167,139,250,0.08)',
  '已完结': 'rgba(16,185,129,0.08)',
};

// ===== Data structures for gantt layout =====
interface DayCell {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  taskCount: number;
}

interface WeekData {
  days: DayCell[];
  bars: TaskBar[];       // all assigned bars (slot 0-4)
  overflowBars: TaskBar[]; // bars that couldn't fit in 5 slots
}

interface TaskBar {
  task: CalendarTask;
  startCol: number; // 0-6 within this week
  endCol: number;   // 0-6 within this week
  slot: number;     // vertical row 0-2
  isStart: boolean; // does the bar start in this week
  isEnd: boolean;   // does the bar end in this week
}

// Build 6 weeks of day cells
function buildWeeks(year: number, month: number): DayCell[][] {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  
  const firstDay = new Date(year, month - 1, 1);
  const startDayOfWeek = firstDay.getDay(); // 0=Sun
  const totalDays = new Date(year, month, 0).getDate();
  
  // Days from prev month
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  const days: DayCell[] = [];
  
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const pm = month === 1 ? 12 : month - 1;
    const py = month === 1 ? year - 1 : year;
    days.push({ date: `${py}-${String(pm).padStart(2,'0')}-${String(d).padStart(2,'0')}`, dayOfMonth: d, isCurrentMonth: false, isToday: false, taskCount: 0 });
  }
  
  // Current month
  for (let d = 1; d <= totalDays; d++) {
    const ds = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    days.push({ date: ds, dayOfMonth: d, isCurrentMonth: true, isToday: ds === todayStr, taskCount: 0 });
  }
  
  // Next month padding
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const nm = month === 12 ? 1 : month + 1;
    const ny = month === 12 ? year + 1 : year;
    days.push({ date: `${ny}-${String(nm).padStart(2,'0')}-${String(d).padStart(2,'0')}`, dayOfMonth: d, isCurrentMonth: false, isToday: false, taskCount: 0 });
  }
  
  // Split into 6 weeks
  const weeks: DayCell[][] = [];
  for (let i = 0; i < 6; i++) {
    weeks.push(days.slice(i * 7, (i + 1) * 7));
  }
  return weeks;
}

// Build task bars for each week
function buildWeekBars(weeks: DayCell[][], allTasks: CalendarTask[]): WeekData[] {
  return weeks.map(week => {
    const weekStartDate = week[0].date;
    const weekEndDate = week[6].date;
    
    // Find tasks that overlap this week
    const overlapping = allTasks.filter(t => 
      t.startDate <= weekEndDate && t.endDate >= weekStartDate
    );
    
    // Build bars with column positions within this week
    const bars: TaskBar[] = overlapping.map(task => {
      const startCol = Math.max(0, dayOfWeek(task.startDate, week));
      const endCol = Math.min(6, dayOfWeek(task.endDate, week));
      return {
        task,
        startCol,
        endCol,
        slot: 0, // will be assigned
        isStart: task.startDate >= weekStartDate && task.startDate <= weekEndDate,
        isEnd: task.endDate >= weekStartDate && task.endDate <= weekEndDate,
      };
    });
    
    // Assign slots (max 5, but display 3 by default)
    const assigned = assignBarsToSlots(bars, 5);
    const fitted = assigned.filter(b => b.slot >= 0);
    const overflow = assigned.filter(b => b.slot < 0);
    
    // Update task count for each day cell
    week.forEach(day => {
      day.taskCount = getTasksForDate(allTasks, day.date).length;
    });
    
    return { days: week, bars: fitted, overflowBars: overflow };
  });
}

// Get day of week (0-6) relative to a given week's start
function dayOfWeek(dateStr: string, week: DayCell[]): number {
  for (let i = 0; i < 7; i++) {
    if (week[i].date === dateStr) return i;
  }
  // If date is before week start, return -1; if after, return 7
  if (dateStr < week[0].date) return -1;
  return 7;
}

function assignBarsToSlots(bars: TaskBar[], maxSlots: number): TaskBar[] {
  const colOccupied: Set<number>[] = Array(7).fill(null).map(() => new Set());
  
  // Sort by duration (longer first)
  const sorted = [...bars].sort((a, b) => (b.endCol - b.startCol) - (a.endCol - a.startCol));
  
  for (const bar of sorted) {
    for (let slot = 0; slot < maxSlots; slot++) {
      let free = true;
      for (let col = bar.startCol; col <= bar.endCol; col++) {
        if (colOccupied[col].has(slot)) { free = false; break; }
      }
      if (free) {
        bar.slot = slot;
        for (let col = bar.startCol; col <= bar.endCol; col++) {
          colOccupied[col].add(slot);
        }
        break;
      }
    }
    if (bar.slot === 0 && sorted.indexOf(bar) >= maxSlots * 2) {
      // Mark as overflow if couldn't find a slot
      bar.slot = -1;
    }
  }
  
  return sorted;
}

// Format date range
function fmtRange(start: string, end: string) {
  const s = start.slice(5).replace('-', '/');
  const e = end.slice(5).replace('-', '/');
  return s === e ? s : `${s}~${e}`;
}

export default function SamplingCalendar({ isOpen, onClose }: SamplingCalendarProps) {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6);
  const [weekOffset, setWeekOffset] = useState(3);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  const allTasks = useMemo(() => generateCalendarTasks(), []);
  
  // Month view: 6 weeks with gantt bars
  const weeks = useMemo(() => {
    const weekCells = buildWeeks(currentYear, currentMonth);
    return buildWeekBars(weekCells, allTasks);
  }, [currentYear, currentMonth, allTasks]);

  // Week view data
  const weekDays = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const sunday = new Date(firstDay);
    sunday.setDate(firstDay.getDate() - firstDay.getDay() + weekOffset * 7);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      days.push({ date: ds, dayOfMonth: d.getDate(), isCurrentMonth: d.getMonth() === currentMonth - 1, isToday: ds === todayStr, dayName: names[i] });
    }
    return days;
  }, [currentYear, currentMonth, weekOffset]);

  // Week view bars
  const weekBars = useMemo(() => {
    const weekStart = weekDays[0].date;
    const weekEnd = weekDays[6].date;
    const overlapping = allTasks.filter(t => t.startDate <= weekEnd && t.endDate >= weekStart);
    
    const bars: TaskBar[] = overlapping.map((task) => {
      let startCol = task.startDate >= weekStart ? new Date(task.startDate).getDay() : 0;
      let endCol = task.endDate <= weekEnd ? new Date(task.endDate).getDay() : 6;
      if (startCol < 0) startCol = 0;
      if (endCol > 6) endCol = 6;
      return {
        task,
        startCol,
        endCol,
        slot: 0,
        isStart: task.startDate >= weekStart,
        isEnd: task.endDate <= weekEnd,
      };
    });
    
    return assignBarsToSlots(bars, 5).filter(b => b.slot >= 0);
  }, [weekDays, allTasks]);

  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];
    return getTasksForDate(allTasks, selectedDate);
  }, [selectedDate, allTasks]);

  const goPrev = useCallback(() => {
    setExpandedWeeks(new Set());
    if (viewMode === 'month') {
      if (currentMonth === 1) { setCurrentYear(y => y - 1); setCurrentMonth(12); }
      else setCurrentMonth(m => m - 1);
    } else setWeekOffset(w => w - 1);
  }, [viewMode, currentMonth]);

  const goNext = useCallback(() => {
    setExpandedWeeks(new Set());
    if (viewMode === 'month') {
      if (currentMonth === 12) { setCurrentYear(y => y + 1); setCurrentMonth(1); }
      else setCurrentMonth(m => m + 1);
    } else setWeekOffset(w => w + 1);
  }, [viewMode, currentMonth]);

  const goToday = useCallback(() => { setExpandedWeeks(new Set()); setCurrentYear(2026); setCurrentMonth(6); setWeekOffset(3); }, []);

  useMemo(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const weekDayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  // Build crew label: "组长·组员1/组员2"
  const buildCrewLabel = (task: CalendarTask) => {
    const members = task.workGroupMembers.slice(0, 2).join('/');
    return `${task.workGroupLeader}·${members}`;
  };

  // Render a gantt bar - NEVER render bars with negative slot (overflow)
  const renderBar = (bar: TaskBar, isWeekView: boolean) => {
    if (bar.slot < 0) return null;
    const { task, startCol, endCol, slot, isStart, isEnd } = bar;
    const color = STATUS_COLOR[task.status] || '#999';
    const bg = STATUS_BG[task.status] || '#f5f5f5';
    const left = (startCol / 7) * 100;
    const width = ((endCol - startCol + 1) / 7) * 100;
    const barHeight = isWeekView ? 40 : 34;
    const topOffset = isWeekView ? 6 + slot * 46 : 30 + slot * 38;
    const isSingle = isStart && isEnd;

    return (
      <div
        key={`${task.id}-${startCol}`}
        className="absolute rounded-sm flex flex-col justify-center overflow-hidden cursor-pointer hover:brightness-95 transition-all"
        style={{
          left: `calc(${left}% + 2px)`,
          width: `calc(${width}% - 4px)`,
          top: `${topOffset}px`,
          height: `${barHeight}px`,
          backgroundColor: bg,
          borderLeft: `3px solid ${color}`,
          borderRadius: isSingle ? '5px' : isStart ? '0 5px 5px 0' : isEnd ? '5px 0 0 5px' : '0px',
          zIndex: 10 + slot,
        }}
        onClick={(e) => { e.stopPropagation(); setSelectedDate(task.startDate); }}
        title={`${task.taskName} · ${buildCrewLabel(task)} · ${fmtRange(task.startDate, task.endDate)} · ${task.status}`}
      >
        {isStart && (
          <div className="flex flex-col px-1.5 gap-0.5 overflow-hidden">
            <span className="text-[11px] truncate font-semibold leading-tight" style={{ color }}>
              {task.taskName}
            </span>
            <span className="text-[9px] truncate leading-tight opacity-70" style={{ color }}>
              {buildCrewLabel(task)}
            </span>
          </div>
        )}
        {!isStart && isEnd && (
          <div className="w-full h-full flex items-center justify-end pr-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${color}50` }} />
          </div>
        )}
        {!isStart && !isEnd && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4 h-[2px] rounded-full" style={{ backgroundColor: `${color}25` }} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={onClose} />
      <div className="absolute inset-4 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ animation: 'calendarIn 250ms ease-out', background: '#F0F2F5', border: '1px solid #E4E7ED' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: '#E4E7ED' }}>
          <div className="flex items-center gap-3">
            <CalendarIcon size={20} style={{ color: '#262626' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#262626' }}>采样日历</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(24,29,38,0.06)', color: '#262626' }}>任务视图</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: '#E4E7ED' }}>
              <button onClick={() => { setViewMode('month'); setExpandedWeeks(new Set()); }} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ backgroundColor: viewMode === 'month' ? '#262626' : 'transparent', color: viewMode === 'month' ? '#ffffff' : '#595959' }}>
                <LayoutGrid size={12} />月
              </button>
              <button onClick={() => { setViewMode('week'); setExpandedWeeks(new Set()); }} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ backgroundColor: viewMode === 'week' ? '#262626' : 'transparent', color: viewMode === 'week' ? '#ffffff' : '#595959' }}>
                <List size={12} />周
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={goPrev} className="w-7 h-7 flex items-center justify-center rounded-lg hover:opacity-80 transition-colors">
                <ChevronLeft size={16} style={{ color: '#595959' }} />
              </button>
              <span className="text-sm font-semibold min-w-[100px] text-center" style={{ color: '#262626' }}>{currentYear}年{currentMonth}月</span>
              <button onClick={goNext} className="w-7 h-7 flex items-center justify-center rounded-lg hover:opacity-80 transition-colors">
                <ChevronRight size={16} style={{ color: '#595959' }} />
              </button>
            </div>
            <button onClick={goToday} className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
              style={{ borderColor: '#E4E7ED', color: '#595959' }}>今天</button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-80 transition-colors ml-2">
              <X size={18} style={{ color: '#595959' }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b shrink-0" style={{ borderColor: '#E4E7ED' }}>
              {weekDayNames.map(name => (
                <div key={name} className="py-2 text-center text-xs font-semibold" style={{ color: '#595959' }}>{name}</div>
              ))}
            </div>

            {viewMode === 'month' ? (
              /* ===== MONTH VIEW: Gantt with expand ===== */
              <div className="flex-1 flex flex-col overflow-y-auto">
                {weeks.map((week, wIdx) => {
                  const isExpanded = expandedWeeks.has(wIdx);
                  const visibleBars = isExpanded ? week.bars : week.bars.filter(b => b.slot < 3);
                  const slot3to4Count = week.bars.filter(b => b.slot >= 3).length;
                  const overflowCount = week.overflowBars.length;
                  const hasMore = slot3to4Count > 0 || overflowCount > 0;
                  const rowMinH = isExpanded ? 210 : 142;

                  return (
                    <div key={wIdx} className="relative grid grid-cols-7 border-b" style={{ borderColor: '#E4E7ED', minHeight: `${rowMinH}px` }}>
                      {/* 7 day cells */}
                      {week.days.map(day => (
                        <div
                          key={day.date}
                          className="border-r p-1"
                          style={{
                            borderColor: '#E4E7ED',
                            backgroundColor: day.isToday ? 'rgba(34,197,94,0.06)' : !day.isCurrentMonth ? 'rgba(14,18,35,0.8)' : 'transparent',
                            opacity: day.isCurrentMonth ? 1 : 0.5,
                          }}
                          onClick={() => day.taskCount > 0 && setSelectedDate(day.date)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full"
                              style={{
                                color: day.isToday ? '#ffffff' : !day.isCurrentMonth ? '#8C8C8C' : '#262626',
                                backgroundColor: day.isToday ? '#262626' : 'transparent',
                              }}>
                              {day.dayOfMonth}
                            </span>
                            {day.taskCount > 0 && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(24,29,38,0.06)', color: '#262626' }}>
                                {day.dayOfMonth}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Gantt bars overlay - only render properly slotted bars */}
                      <div className="absolute inset-0 pointer-events-none">
                        {visibleBars.map(bar => renderBar(bar, false))}
                      </div>

                      {/* Today indicator */}
                      {week.days.some(d => d.isToday) && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: '#262626' }} />
                      )}

                      {/* Expand / Collapse button */}
                      {hasMore && (
                        <div className="absolute bottom-[5px] left-0 right-0 flex justify-center pointer-events-auto" style={{ zIndex: 30 }}>
                          <button
                            className="text-[10px] px-3 py-1 rounded-full font-medium transition-all hover:opacity-80 shadow-sm border"
                            style={{ backgroundColor: '#F0F2F5', color: '#262626', borderColor: '#262626' }}
                            onClick={() => setExpandedWeeks(prev => {
                              const next = new Set(prev);
                              if (next.has(wIdx)) next.delete(wIdx); else next.add(wIdx);
                              return next;
                            })}
                          >
                            {isExpanded ? '收起' : `还有 ${slot3to4Count + overflowCount} 个任务`}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ===== WEEK VIEW: Header + Gantt Area ===== */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header row: fixed height, never covered by bars */}
                <div className="grid grid-cols-7 divide-x shrink-0 h-[56px]" style={{ borderColor: '#E4E7ED' }}>
                  {weekDays.map(day => {
                    const tasks = getTasksForDate(allTasks, day.date);
                    return (
                      <div key={day.date} className="flex flex-col items-center justify-center py-1" style={{ backgroundColor: day.isToday ? 'rgba(34,197,94,0.06)' : 'transparent' }}>
                        <div className="text-[11px] font-medium" style={{ color: '#8C8C8C' }}>{day.dayName}</div>
                        <div className="flex items-center gap-1">
                          <span className="text-base font-bold" style={{ color: day.isToday ? '#262626' : '#262626' }}>{day.dayOfMonth}</span>
                          {tasks.length > 0 && (
                            <span className="text-[9px] font-semibold px-1 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(24,29,38,0.06)', color: '#262626' }}>
                              {tasks.length}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Gantt area: bars render here, completely below header */}
                <div className="relative flex-1">
                  {/* Background grid lines */}
                  <div className="absolute inset-0 grid grid-cols-7 divide-x" style={{ borderColor: '#E4E7ED' }}>
                    {weekDays.map(day => <div key={day.date} className="h-full" style={{ backgroundColor: day.isToday ? 'rgba(34,197,94,0.04)' : 'transparent' }} />)}
                  </div>
                  {/* Bars */}
                  <div className="absolute inset-0 pointer-events-none">
                    {weekBars.map(bar => renderBar(bar, true))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          {selectedDate && (
            <div className="w-[340px] border-l flex flex-col shrink-0" style={{ borderColor: '#E4E7ED' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E4E7ED' }}>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: '#262626' }}>{selectedDate} 任务详情</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#8C8C8C' }}>涉及 {selectedDateTasks.length} 个采样任务</p>
                </div>
                <button onClick={() => setSelectedDate(null)} className="w-6 h-6 flex items-center justify-center rounded hover:opacity-80"><X size={14} style={{ color: '#8C8C8C' }} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {selectedDateTasks.map(task => {
                  const pos = selectedDate === task.startDate ? 'start' : selectedDate === task.endDate ? 'end' : 'mid';
                  return (
                    <div key={task.id} className="p-3 rounded-lg border" style={{ borderColor: '#E4E7ED', borderLeft: `3px solid ${STATUS_COLOR[task.status] || '#999'}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${STATUS_COLOR[task.status]}15`, color: STATUS_COLOR[task.status] }}>
                          {STATUS_ICON[task.status]}{task.status}
                        </span>
                        <span className="text-[10px]" style={{ color: '#8C8C8C' }}>{fmtRange(task.startDate, task.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {pos === 'start' && <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#FA8C1615', color: '#FA8C16' }}>采样开始日</span>}
                        {pos === 'end' && <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#52C41A15', color: '#52C41A' }}>采样结束日</span>}
                        {pos === 'mid' && <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#1677FF15', color: '#1677FF' }}>采样进行中</span>}
                      </div>
                      <p className="text-sm font-medium mb-1" style={{ color: '#262626' }}>{task.taskName}</p>
                      <p className="text-[11px] mb-2" style={{ color: '#595959' }}>{task.projectName}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px]" style={{ color: '#8C8C8C' }}><Users size={9} /><span>工作组: <span style={{ color: '#262626' }}>{task.workGroup}</span></span></div>
                        <div className="flex items-center gap-1 text-[10px]" style={{ color: '#8C8C8C' }}><Users size={9} /><span>组长: <span style={{ color: '#262626' }}>{task.workGroupLeader}</span></span></div>
                        <div className="flex items-center gap-1 text-[10px]" style={{ color: '#8C8C8C' }}><Users size={9} /><span>组员: <span style={{ color: '#262626' }}>{task.workGroupMembers.join('、')}</span></span></div>
                        <div className="flex items-center gap-1 text-[10px]" style={{ color: '#8C8C8C' }}><MapPin size={9} /><span>{task.city}{task.district}</span></div>
                      </div>
                      <div className="mt-2 pt-2" style={{ borderTop: '1px solid #E4E7ED' }}>
                        <span className="text-[10px]" style={{ color: '#8C8C8C' }}>{task.clientName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex items-center gap-6 shrink-0" style={{ borderColor: '#E4E7ED' }}>
          <span className="text-xs" style={{ color: '#8C8C8C' }}><span className="font-semibold" style={{ color: '#262626' }}>{allTasks.length}</span> 个采样任务</span>
          <span className="text-xs" style={{ color: '#8C8C8C' }}><span className="font-semibold" style={{ color: '#262626' }}>{new Set(allTasks.map(t => t.workGroup)).size}</span> 个工作组</span>
          <span className="text-xs" style={{ color: '#8C8C8C' }}><span className="font-semibold" style={{ color: '#262626' }}>{new Set(allTasks.map(t => t.projectId)).size}</span> 个关联项目</span>
          <div className="ml-auto flex items-center gap-3">
            {(['待采样', '采样中', '运输中', '已完结'] as const).map(s => (
              <span key={s} className="flex items-center gap-1 text-[10px]" style={{ color: STATUS_COLOR[s] }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[s] }} />{s}: {allTasks.filter(t => t.status === s).length}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes calendarIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
