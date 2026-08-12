import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import type { Project } from '@/types/dashboard';

interface ProjectDistributionProps {
  projects: Project[];
  onSliceClick: (statusLabel: string) => void;
}

export default function ProjectDistribution({ projects, onSliceClick }: ProjectDistributionProps) {
  const statusCounts: Record<string, number> = {};
  projects.forEach(p => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
  });

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending_assign: { label: '待分配', color: '#ff8f00' },
    pending_sample: { label: '待采样', color: '#00bcd4' },
    sampling: { label: '采样中', color: '#1a6bfe' },
    transporting: { label: '运输中', color: '#7e57c2' },
    pre_task: { label: '预任务池', color: '#8a96a8' },
    completed: { label: '已完结', color: '#43a047' },
  };

  // Reverse map: label -> status key
  const labelToStatus: Record<string, string> = {};
  Object.entries(statusConfig).forEach(([key, val]) => { labelToStatus[val.label] = key; });

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: statusConfig[status]?.label || status,
    value: count,
    itemStyle: { color: statusConfig[status]?.color || '#999' },
  }));

  const total = projects.length;

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#e2e6ed',
      borderWidth: 1,
      textStyle: { color: '#1a2332', fontSize: 12 },
      formatter: (params: any) => {
        return `<div style="font-weight:600">${params.name}</div>
                <div style="color:#5a6a7f">${params.value} 个任务 (${params.percent}%)</div>`;
      },
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 12,
      textStyle: { color: '#5a6a7f', fontSize: 12 },
      formatter: (name: string) => {
        const item = data.find(d => d.name === name);
        return `${name}  ${item?.value || 0}`;
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['48%', '74%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' },
        },
        labelLine: { show: false },
        data,
        selectedMode: 'single',
        select: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
    ],
  };

  const handleChartClick = (params: any) => {
    if (params?.name) {
      const statusKey = labelToStatus[params.name];
      if (statusKey) onSliceClick(statusKey);
    }
  };

  return (
    <div className="dash-card p-5 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--dash-text)' }}>
          采样任务状态分布
        </h3>
      </div>
      <div className="relative">
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: 280 }}
          onEvents={{
            click: handleChartClick,
          }}
          notMerge={true}
          lazyUpdate={true}
        />
        {/* Center text overlay */}
        <div
          className="absolute flex flex-col items-center justify-center pointer-events-none"
          style={{
            left: '38%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="text-3xl font-bold leading-none" style={{ color: '#1a2332' }}>
            {total}
          </span>
          <span className="text-xs mt-1" style={{ color: '#8a96a8' }}>
            个任务
          </span>
        </div>
      </div>
    </div>
  );
}
