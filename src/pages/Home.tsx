import { useState, useCallback } from 'react';
import Header from '@/sections/Header';
import StatusPipeline from '@/sections/StatusPipeline';
import KpiCards from '@/sections/KpiCards';
import TaskDurationDistribution from '@/sections/TaskDurationDistribution';
import LeaderLoad from '@/sections/LeaderLoad';
import TaskTrend from '@/sections/TaskTrend';
import IdlePersonnel from '@/sections/IdlePersonnel';
import TotalOutputValue from '@/sections/TotalOutputValue';
import PersonnelTaskRanking from '@/sections/PersonnelTaskRanking';
import PersonnelOutputRanking from '@/sections/PersonnelOutputRanking';
import AreaDistribution from '@/sections/AreaDistribution';
import OverdueProjects from '@/sections/OverdueProjects';
import ClientStats from '@/sections/ClientStats';
import DetailDrawer from '@/sections/DetailDrawer';
import SamplingCalendar from '@/sections/SamplingCalendar';
import { getFilteredByClient, clientStats } from '@/data/mockData';
import { STATUS_CONFIG } from '@/types/dashboard';

export default function Home() {
  const [selectedClient, setSelectedClient] = useState('全部客户');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [drawerFilterType, setDrawerFilterType] = useState<'status' | 'workgroup' | 'project' | 'client' | 'area' | ''>('');
  const [drawerFilterValue, setDrawerFilterValue] = useState('');

  // Calendar state
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Get filtered data (task-centric)
  const { projects: tasks, statusCounts } = getFilteredByClient(selectedClient);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  // Client change handler
  const handleClientChange = useCallback((client: string) => {
    setSelectedClient(client);
  }, []);

  // Open drawer with status filter
  const handleStatusCardClick = useCallback((status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    setDrawerTitle(`${config?.label || status}任务列表`);
    setDrawerFilterType('status');
    setDrawerFilterValue(status);
    setDrawerOpen(true);
  }, []);

  // Open drawer with workgroup filter
  const handleWorkgroupClick = useCallback((name: string) => {
    if (name) {
      setDrawerTitle(`${name}组任务列表`);
    } else {
      setDrawerTitle('工作组任务列表');
    }
    setDrawerFilterType('workgroup');
    setDrawerFilterValue(name);
    setDrawerOpen(true);
  }, []);

  // Open drawer with task filter
  const handleTaskClick = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setDrawerTitle(task ? `${task.name} - 任务详情` : '任务列表');
    setDrawerFilterType('project');
    setDrawerFilterValue(taskId);
    setDrawerOpen(true);
  }, [tasks]);

  // Open drawer with client filter
  const handleClientClick = useCallback((clientName: string) => {
    setDrawerTitle(`${clientName} - 任务列表`);
    setDrawerFilterType('client');
    setDrawerFilterValue(clientName);
    setDrawerOpen(true);
  }, []);

  // Open drawer with area filter
  const handleAreaClick = useCallback((areaName: string) => {
    setDrawerTitle(`${areaName} - 区域任务列表`);
    setDrawerFilterType('area');
    setDrawerFilterValue(areaName);
    setDrawerOpen(true);
  }, []);

  // Open calendar
  const handleOpenCalendar = useCallback(() => {
    setCalendarOpen(true);
  }, []);

  // KPI card click handler (matches kpiData order: 超期/总数/活跃/空闲)
  const handleKpiClick = useCallback((index: number) => {
    switch (index) {
      case 0: // 超期任务数
        setDrawerTitle('超期任务列表');
        setDrawerFilterType('');
        setDrawerFilterValue('overdue');
        break;
      case 1: // 采样任务总数
        setDrawerTitle('全部采样任务');
        setDrawerFilterType('');
        setDrawerFilterValue('');
        break;
      case 2: // 活跃任务数
        setDrawerTitle('活跃任务列表');
        setDrawerFilterType('');
        setDrawerFilterValue('active');
        break;
      case 3: // 空闲人员数
        setDrawerTitle('空闲人员列表');
        setDrawerFilterType('workgroup');
        setDrawerFilterValue('idle');
        break;
    }
    setDrawerOpen(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F0F2F5' }}>
      <Header
        selectedClient={selectedClient}
        onClientChange={handleClientChange}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onOpenCalendar={handleOpenCalendar}
      />

      <main className="p-6 space-y-4">
        {/* Row 1: Total tasks + 4 status cards */}
        <StatusPipeline data={statusCounts} totalTasks={77} onCardClick={handleStatusCardClick} onTotalClick={() => handleKpiClick(1)} />

        {/* Row 2: 3 KPI cards */}
        <KpiCards onCardClick={handleKpiClick} />

        {/* Charts Row 1: Task Duration Distribution + Leader Load */}
        <div className="grid grid-cols-2 gap-4">
          <TaskDurationDistribution tasks={tasks} onSliceClick={handleStatusCardClick} />
          <LeaderLoad onLeaderClick={handleWorkgroupClick} />
        </div>

        {/* Charts Row 2: Total Output Value + Personnel Rankings */}
        <div className="grid grid-cols-3 gap-4">
          <TotalOutputValue />
          <PersonnelTaskRanking />
          <PersonnelOutputRanking />
        </div>

        {/* Charts Row 3: Task Trend + Idle Personnel */}
        <div className="grid grid-cols-2 gap-4">
          <TaskTrend />
          <IdlePersonnel onPersonClick={handleWorkgroupClick} />
        </div>

        {/* Area Distribution */}
        <AreaDistribution onAreaClick={handleAreaClick} onClientClick={handleClientClick} />

        {/* Overdue Tasks Table */}
        <OverdueProjects projects={tasks} onProjectClick={handleTaskClick} />

        {/* Client Stats Table */}
        <ClientStats data={clientStats} onClientClick={handleClientClick} />
      </main>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerTitle}
        filterType={drawerFilterType}
        filterValue={drawerFilterValue}
      />

      {/* Sampling Calendar Modal */}
      <SamplingCalendar
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
      />
    </div>
  );
}
