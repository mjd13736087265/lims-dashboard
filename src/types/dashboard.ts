export type ProjectStatus = 'pending_assign' | 'pending_sample' | 'sampling' | 'transporting' | 'pre_task' | 'completed';

export interface Project {
  id: string;
  projectNo: string;
  name: string;
  clientName: string;
  serviceCycle: 'urgent' | 'normal';
  status: ProjectStatus;
  taskCount: number;
  entrustDate: string;
  deadline: string;
  daysElapsed: number;
}

export interface Task {
  id: string;
  taskNo: string;
  taskName: string;
  projectId: string;
  projectName: string;
  detectCategory: string;
  pointNo: string;
  pointName: string;
  status: string;
  workGroup: string;
  sampleNo: string;
  taskAmount: number; // 任务金额（元）
}

export interface WorkGroup {
  id: string;
  name: string;
  leader: string;
  members: string[];
  vehiclePlate: string;
  driver: string;
  currentTasks: number;
  borrowedInstruments: number;
  status: 'active' | 'inactive';
}

export interface ClientStats {
  clientName: string;
  projectCount: number;
  totalTasks: number;
  statusDistribution: Record<string, number>;
}

export interface StatusCount {
  status: ProjectStatus;
  label: string;
  count: number;
  dailyChange: number;
  color: string;
}

export const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  pending_assign: { label: '待分配', color: '#ff8f00' },
  pending_sample: { label: '待采样', color: '#00bcd4' },
  sampling: { label: '采样中', color: '#1a6bfe' },
  transporting: { label: '运输中', color: '#7e57c2' },
  pre_task: { label: '预任务池', color: '#8a96a8' },
  completed: { label: '已完结', color: '#43a047' },
};

export const CLIENTS = [
  '全部客户',
  '浙江淘宝网络有限公司',
  '浙江致和信息科技有限公司',
  '浙江三洲检测认证有限公司',
  '宁波均胜电子股份有限公司',
  '新余赣科文化传媒有限公司',
];

// Client to area mapping (city + district)
export interface ClientArea {
  clientName: string;
  city: string;
  district: string;
}

export interface AreaStats {
  city: string;
  district: string;
  fullName: string; // e.g. "杭州市西湖区"
  projectCount: number;
  taskCount: number;
  clientCount: number;
  clients: string[];
  statusDistribution: Record<string, number>;
}
