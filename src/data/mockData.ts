import type { Project, Task, WorkGroup, ClientStats, StatusCount, ClientArea, AreaStats } from '@/types/dashboard';

// Status counts for pipeline (4 cards, no transporting)
export const statusCounts: StatusCount[] = [
  { status: 'pending_assign', label: '待分配', count: 12, dailyChange: 2, color: '#ff8f00' },
  { status: 'pending_sample', label: '待采样', count: 8, dailyChange: -1, color: '#00bcd4' },
  { status: 'sampling', label: '采样中', count: 15, dailyChange: 5, color: '#1a6bfe' },
  { status: 'completed', label: '已完结', count: 42, dailyChange: 8, color: '#43a047' },
];

// KPI data - task-centric, total tasks first
export const kpiData = [
  { label: '超期任务数', value: 5, unit: '个', sub: '需重点关注', color: '#e53935' },
  { label: '采样任务总数', value: 86, unit: '个', sub: '本月新增 12 个', color: '#1a6bfe' },
  { label: '活跃任务数', value: 41, unit: '个', sub: '较昨日 +7', color: '#00bcd4' },
  { label: '空闲人员数', value: 4, unit: '人', sub: '可分配任务', color: '#43a047' },
];

// Tasks (task-centric mock data)
export const projects: Project[] = [
  {
    id: '1', projectNo: 'J/H260096', name: '地表水采样任务-01',
    clientName: '浙江淘宝网络有限公司', serviceCycle: 'urgent',
    status: 'sampling', taskCount: 3,
    entrustDate: '2026-06-25', deadline: '2027-06-28', daysElapsed: 1,
  },
  {
    id: '2', projectNo: 'J/H260080', name: '环境空气采样任务-02',
    clientName: '浙江致和信息科技有限公司', serviceCycle: 'normal',
    status: 'pending_sample', taskCount: 1,
    entrustDate: '2026-06-24', deadline: '2026-06-16', daysElapsed: 2,
  },
  {
    id: '3', projectNo: 'Z(J)/H260043', name: '土壤采样任务-03',
    clientName: '浙江三洲检测认证有限公司', serviceCycle: 'normal',
    status: 'sampling', taskCount: 8,
    entrustDate: '2026-06-23', deadline: '2026-06-13', daysElapsed: 3,
  },
  {
    id: '4', projectNo: 'J/H260093', name: '噪声监测任务-04',
    clientName: '新余赣科文化传媒有限公司', serviceCycle: 'normal',
    status: 'pending_assign', taskCount: 1,
    entrustDate: '2026-06-22', deadline: '2026-06-30', daysElapsed: 4,
  },
  {
    id: '5', projectNo: 'J/H260092', name: '地下水采样任务-05',
    clientName: '浙江致和信息科技有限公司', serviceCycle: 'normal',
    status: 'sampling', taskCount: 1,
    entrustDate: '2026-06-20', deadline: '2026-06-27', daysElapsed: 6,
  },
  {
    id: '6', projectNo: 'Z(J)/H260044', name: '地表水采样任务-06',
    clientName: '浙江三洲检测认证有限公司', serviceCycle: 'normal',
    status: 'sampling', taskCount: 6,
    entrustDate: '2026-06-18', deadline: '2026-06-19', daysElapsed: 8,
  },
  {
    id: '7', projectNo: 'Z(J)/H260042', name: '环境空气采样任务-07',
    clientName: '宁波均胜电子股份有限公司', serviceCycle: 'normal',
    status: 'transporting', taskCount: 5,
    entrustDate: '2026-06-15', deadline: '2026-06-16', daysElapsed: 11,
  },
  {
    id: '8', projectNo: 'J/H260091', name: '土壤采样任务-08',
    clientName: '宁波均胜电子股份有限公司', serviceCycle: 'normal',
    status: 'completed', taskCount: 1,
    entrustDate: '2026-06-12', deadline: '2026-07-04', daysElapsed: 14,
  },
  {
    id: '9', projectNo: 'J/H260082', name: '地下水采样任务-09',
    clientName: '新余赣科文化传媒有限公司', serviceCycle: 'normal',
    status: 'transporting', taskCount: 3,
    entrustDate: '2026-06-10', deadline: '2026-07-31', daysElapsed: 16,
  },
  {
    id: '10', projectNo: 'J/H260081', name: '地表水采样任务-10',
    clientName: '浙江淘宝网络有限公司', serviceCycle: 'urgent',
    status: 'pending_sample', taskCount: 4,
    entrustDate: '2026-06-08', deadline: '2026-06-30', daysElapsed: 18,
  },
  {
    id: '11', projectNo: 'J/H260087', name: '噪声监测任务-11',
    clientName: '浙江致和信息科技有限公司', serviceCycle: 'urgent',
    status: 'sampling', taskCount: 5,
    entrustDate: '2026-06-05', deadline: '2026-06-27', daysElapsed: 21,
  },
  {
    id: '12', projectNo: 'J/H260083', name: '环境空气采样任务-12',
    clientName: '浙江三洲检测认证有限公司', serviceCycle: 'urgent',
    status: 'pending_assign', taskCount: 6,
    entrustDate: '2026-06-03', deadline: '2026-06-21', daysElapsed: 23,
  },
  {
    id: '13', projectNo: 'J/H260086', name: '土壤采样任务-13',
    clientName: '浙江淘宝网络有限公司', serviceCycle: 'normal',
    status: 'completed', taskCount: 2,
    entrustDate: '2026-06-01', deadline: '2026-06-20', daysElapsed: 25,
  },
  {
    id: '14', projectNo: 'J/H260085', name: '地下水采样任务-14',
    clientName: '浙江致和信息科技有限公司', serviceCycle: 'normal',
    status: 'completed', taskCount: 2,
    entrustDate: '2026-05-28', deadline: '2026-06-20', daysElapsed: 29,
  },
  {
    id: '15', projectNo: 'J/H260090', name: '地表水采样任务-15',
    clientName: '宁波均胜电子股份有限公司', serviceCycle: 'urgent',
    status: 'sampling', taskCount: 3,
    entrustDate: '2026-05-20', deadline: '2026-06-27', daysElapsed: 37,
  },
];

// WorkGroups
export const workGroups: WorkGroup[] = [
  { id: '1', name: '王晓王', leader: '王小王', members: ['王小王', '石亮', '刘喜龙'], vehiclePlate: '', driver: '', currentTasks: 16, borrowedInstruments: 0, status: 'active' },
  { id: '2', name: '张如强', leader: '张如强', members: ['石亮', '李迪', '刘喜龙'], vehiclePlate: '', driver: '', currentTasks: 9, borrowedInstruments: 0, status: 'active' },
  { id: '3', name: '王小', leader: '王小', members: ['王小', '石亮', '刘喜龙', 'zzz'], vehiclePlate: '', driver: '', currentTasks: 4, borrowedInstruments: 0, status: 'active' },
  { id: '4', name: '刘喜龙', leader: '刘喜龙', members: ['石亮', '刘喜龙'], vehiclePlate: '京888888', driver: 'lx', currentTasks: 3, borrowedInstruments: 0, status: 'active' },
  { id: '5', name: '毛金达', leader: '毛金达', members: ['毛金达', '刘喜龙', '石亮'], vehiclePlate: '', driver: '', currentTasks: 2, borrowedInstruments: 0, status: 'active' },
  { id: '6', name: '石亮', leader: '石亮', members: ['石亮'], vehiclePlate: '', driver: '', currentTasks: 1, borrowedInstruments: 0, status: 'active' },
  { id: '7', name: 'zzz', leader: 'zzz', members: ['zzz', '石亮', '刘喜龙'], vehiclePlate: '', driver: '', currentTasks: 1, borrowedInstruments: 0, status: 'active' },
];

// Tasks for detail drawer
export const tasks: Task[] = [
  { id: '1', taskNo: 'Z(J)/H260044-7', taskName: '多点位625', projectId: '6', projectName: '6.18测试数据报价系统数据001', detectCategory: '环境空气', pointNo: 'QH1', pointName: '222', status: '待采样', workGroup: '', sampleNo: '', taskAmount: 8500 },
  { id: '2', taskNo: 'Z(J)/H260044-6', taskName: '测试商场数据', projectId: '6', projectName: '6.18测试数据报价系统数据001', detectCategory: '环境空气', pointNo: 'QH2', pointName: '42', status: '采样中', workGroup: '王晓王', sampleNo: '', taskAmount: 12000 },
  { id: '3', taskNo: 'Z(J)/H260044-5', taskName: '232', projectId: '6', projectName: '6.18测试数据报价系统数据001', detectCategory: '地表水', pointNo: 'WB1', pointName: '42', status: '采样中', workGroup: '王晓王', sampleNo: '', taskAmount: 6800 },
  { id: '4', taskNo: 'Z(J)/H260044-4', taskName: '点位', projectId: '6', projectName: '6.18测试数据报价系统数据001', detectCategory: '环境空气', pointNo: 'QH1', pointName: '221', status: '采样中', workGroup: '王晓王', sampleNo: '', taskAmount: 9500 },
  { id: '5', taskNo: 'Z(J)/H260044-3', taskName: 'ERWEW', projectId: '6', projectName: '6.18测试数据报价系统数据001', detectCategory: '地表水', pointNo: 'WB1', pointName: '41', status: '采样中', workGroup: '王小', sampleNo: '', taskAmount: 15000 },
  { id: '6', taskNo: 'Z(J)/H260044-2', taskName: 'EEE', projectId: '6', projectName: '6.18测试数据报价系统数据001', detectCategory: '环境空气', pointNo: 'QH2', pointName: '222', status: '运输中', workGroup: '刘喜龙', sampleNo: '', taskAmount: 7200 },
  { id: '7', taskNo: 'Z(J)/H260044-1', taskName: '6.18测试让你无数据001', projectId: '6', projectName: '6.18测试数据报价系统数据001', detectCategory: '环境空气', pointNo: 'QH1', pointName: '21', status: '已完结', workGroup: '王晓王', sampleNo: '', taskAmount: 23000 },
  { id: '8', taskNo: 'Z(J)/H260043-9', taskName: '6.18任务委托数据003', projectId: '3', projectName: '6.17测试数据报价系统数据001', detectCategory: '地表水', pointNo: 'WB1', pointName: '11', status: '待分配', workGroup: '', sampleNo: '', taskAmount: 11200 },
  { id: '9', taskNo: 'Z(J)/H260043-8', taskName: '6.18好测试任务数据002', projectId: '3', projectName: '6.17测试数据报价系统数据001', detectCategory: '环境空气', pointNo: 'QH1', pointName: '222', status: '采样中', workGroup: '张如强', sampleNo: '', taskAmount: 18600 },
  { id: '10', taskNo: 'Z(J)/H260043-7', taskName: '6.18任务数据001', projectId: '3', projectName: '6.17测试数据报价系统数据001', detectCategory: '环境空气', pointNo: 'QH1', pointName: '21', status: '采样中', workGroup: '王晓王', sampleNo: '', taskAmount: 24800 },
];

// Client statistics - task-centric (8 clients for pagination testing)
export const clientStats: ClientStats[] = [
  { clientName: '浙江淘宝网络有限公司', projectCount: 18, totalTasks: 18, statusDistribution: { pending_assign: 2, pending_sample: 1, sampling: 8, transporting: 2, pre_task: 0, completed: 5 } },
  { clientName: '浙江致和信息科技有限公司', projectCount: 15, totalTasks: 15, statusDistribution: { pending_assign: 3, pending_sample: 2, sampling: 4, transporting: 1, pre_task: 0, completed: 5 } },
  { clientName: '浙江三洲检测认证有限公司', projectCount: 19, totalTasks: 19, statusDistribution: { pending_assign: 1, pending_sample: 2, sampling: 10, transporting: 3, pre_task: 0, completed: 3 } },
  { clientName: '宁波均胜电子股份有限公司', projectCount: 8, totalTasks: 8, statusDistribution: { pending_assign: 1, pending_sample: 1, sampling: 3, transporting: 1, pre_task: 0, completed: 2 } },
  { clientName: '新余赣科文化传媒有限公司', projectCount: 5, totalTasks: 5, statusDistribution: { pending_assign: 1, pending_sample: 0, sampling: 2, transporting: 0, pre_task: 0, completed: 2 } },
  { clientName: '杭州阿里科技有限公司', projectCount: 12, totalTasks: 12, statusDistribution: { pending_assign: 2, pending_sample: 3, sampling: 4, transporting: 1, pre_task: 0, completed: 2 } },
  { clientName: '温州正泰电器有限公司', projectCount: 7, totalTasks: 7, statusDistribution: { pending_assign: 1, pending_sample: 1, sampling: 2, transporting: 1, pre_task: 0, completed: 2 } },
  { clientName: '嘉兴桐昆集团股份有限公司', projectCount: 10, totalTasks: 10, statusDistribution: { pending_assign: 2, pending_sample: 2, sampling: 3, transporting: 1, pre_task: 0, completed: 2 } },
];

// Generate 30-day trend data
export function generateTrendData(): { dates: string[]; series: Record<string, number[]> } {
  const dates: string[] = [];
  const today = new Date(2026, 5, 26);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }

  const series: Record<string, number[]> = {
    pending_assign: [],
    pending_sample: [],
    sampling: [],
    transporting: [],
  };

  // Generate realistic trend data with slow growth
  let basePending = 8;
  let baseSample = 5;
  let baseSampling = 10;
  let baseTransport = 3;

  for (let i = 0; i < 30; i++) {
    basePending += Math.random() > 0.6 ? 1 : Math.random() > 0.7 ? -1 : 0;
    baseSample += Math.random() > 0.5 ? 1 : Math.random() > 0.6 ? -1 : 0;
    baseSampling += Math.random() > 0.4 ? 1 : Math.random() > 0.5 ? -1 : 0;
    baseTransport += Math.random() > 0.7 ? 1 : Math.random() > 0.8 ? -1 : 0;

    series.pending_assign.push(Math.max(3, Math.min(15, basePending)));
    series.pending_sample.push(Math.max(2, Math.min(12, baseSample)));
    series.sampling.push(Math.max(5, Math.min(20, baseSampling)));
    series.transporting.push(Math.max(1, Math.min(10, baseTransport)));
  }

  return { dates, series };
}

// Client to area mapping (city + district)
export const clientAreas: ClientArea[] = [
  { clientName: '浙江淘宝网络有限公司', city: '杭州市', district: '余杭区' },
  { clientName: '浙江致和信息科技有限公司', city: '杭州市', district: '西湖区' },
  { clientName: '浙江三洲检测认证有限公司', city: '杭州市', district: '滨江区' },
  { clientName: '宁波均胜电子股份有限公司', city: '宁波市', district: '鄞州区' },
  { clientName: '新余赣科文化传媒有限公司', city: '新余市', district: '渝水区' },
];

// Generate area statistics from projects
export function getAreaStats(): AreaStats[] {
  const areaMap: Record<string, AreaStats> = {};

  projects.forEach(project => {
    const clientArea = clientAreas.find(ca => ca.clientName === project.clientName);
    if (!clientArea) return;

    const key = `${clientArea.city}-${clientArea.district}`;
    if (!areaMap[key]) {
      areaMap[key] = {
        city: clientArea.city,
        district: clientArea.district,
        fullName: `${clientArea.city}${clientArea.district}`,
        projectCount: 0,
        taskCount: 0,
        clientCount: 0,
        clients: [],
        statusDistribution: {},
      };
    }

    const area = areaMap[key];
    area.projectCount += 1;
    area.taskCount += 1;
    if (!area.clients.includes(project.clientName)) {
      area.clients.push(project.clientName);
      area.clientCount += 1;
    }
    area.statusDistribution[project.status] = (area.statusDistribution[project.status] || 0) + 1;
  });

  return Object.values(areaMap).sort((a, b) => b.taskCount - a.taskCount);
}

// Get filtered data by client
export function getFilteredByClient(clientName: string) {
  if (clientName === '全部客户' || !clientName) {
    return { projects, workGroups, clientStats, statusCounts };
  }

  const filteredProjects = projects.filter(p => p.clientName === clientName);
  const filteredClientStats = clientStats.filter(c => c.clientName === clientName);

  // Recalculate status counts
  const counts: Record<string, number> = {};
  filteredProjects.forEach(p => {
    counts[p.status] = (counts[p.status] || 0) + 1;
  });

  const filteredStatusCounts = statusCounts.map(s => ({
    ...s,
    count: counts[s.status] || 0,
  }));

  return {
    projects: filteredProjects,
    workGroups,
    clientStats: filteredClientStats,
    statusCounts: filteredStatusCounts,
  };
}

// Project leaders and their task counts
export interface ProjectLeader {
  name: string;
  taskCount: number;
  activeTasks: number;
  completedTasks: number;
}

export const projectLeaders: ProjectLeader[] = [
  { name: '王晓王', taskCount: 18, activeTasks: 12, completedTasks: 6 },
  { name: '张如强', taskCount: 14, activeTasks: 9, completedTasks: 5 },
  { name: '王小', taskCount: 11, activeTasks: 7, completedTasks: 4 },
  { name: '刘喜龙', taskCount: 9, activeTasks: 5, completedTasks: 4 },
  { name: '毛金达', taskCount: 7, activeTasks: 4, completedTasks: 3 },
  { name: '石亮', taskCount: 5, activeTasks: 3, completedTasks: 2 },
  { name: '周杰', taskCount: 3, activeTasks: 1, completedTasks: 2 },
  { name: '李迪', taskCount: 6, activeTasks: 4, completedTasks: 2 },
  { name: '陈明', taskCount: 4, activeTasks: 2, completedTasks: 2 },
  { name: '赵伟', taskCount: 8, activeTasks: 5, completedTasks: 3 },
];

// All personnel (independent of workgroups)
export interface Personnel {
  id: string;
  name: string;
  currentTasks: number;
  phone: string;
  role: string;
}

export const allPersonnel: Personnel[] = [
  { id: '1', name: '王晓王', currentTasks: 12, phone: '138****1234', role: '项目负责人' },
  { id: '2', name: '张如强', currentTasks: 9, phone: '139****5678', role: '采样员' },
  { id: '3', name: '王小', currentTasks: 7, phone: '137****9012', role: '采样员' },
  { id: '4', name: '刘喜龙', currentTasks: 5, phone: '136****3456', role: '采样员' },
  { id: '5', name: '毛金达', currentTasks: 4, phone: '135****7890', role: '采样员' },
  { id: '6', name: '石亮', currentTasks: 3, phone: '134****2345', role: '采样员' },
  { id: '7', name: '周杰', currentTasks: 1, phone: '133****6789', role: '实习生' },
  { id: '8', name: '李迪', currentTasks: 4, phone: '132****0123', role: '采样员' },
  { id: '9', name: '陈明', currentTasks: 2, phone: '131****4567', role: '项目负责人' },
  { id: '10', name: '赵伟', currentTasks: 5, phone: '130****8901', role: '采样员' },
  { id: '11', name: '孙丽', currentTasks: 0, phone: '159****2345', role: '采样员' },
  { id: '12', name: '周杰', currentTasks: 0, phone: '158****6789', role: '采样员' },
  { id: '13', name: '吴芳', currentTasks: 0, phone: '157****0123', role: '实习生' },
  { id: '14', name: '郑涛', currentTasks: 0, phone: '156****4567', role: '采样员' },
  { id: '15', name: '黄磊', currentTasks: 2, phone: '155****8901', role: '项目负责人' },
  { id: '16', name: '林静', currentTasks: 1, phone: '154****3456', role: '采样员' },
  { id: '17', name: '徐鹏', currentTasks: 3, phone: '153****7890', role: '采样员' },
  { id: '18', name: '谢薇', currentTasks: 0, phone: '152****1234', role: '实习生' },
  { id: '19', name: '马云', currentTasks: 6, phone: '151****5678', role: '项目负责人' },
  { id: '20', name: '杨洋', currentTasks: 2, phone: '150****9012', role: '采样员' },
];
