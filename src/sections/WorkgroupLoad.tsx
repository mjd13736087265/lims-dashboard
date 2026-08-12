import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import type { WorkGroup } from '@/types/dashboard';

interface WorkgroupLoadProps {
  workGroups: WorkGroup[];
  onWorkgroupClick: (name: string) => void;
}

export default function WorkgroupLoad({ workGroups, onWorkgroupClick }: WorkgroupLoadProps) {
  const sorted = [...workGroups].sort((a, b) => b.currentTasks - a.currentTasks);

  const getBarColor = (count: number) => {
    if (count <= 3) return '#43a047';
    if (count <= 8) return '#1a6bfe';
    return '#ff8f00';
  };

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#fff',
      borderColor: '#e2e6ed',
      borderWidth: 1,
      textStyle: { color: '#1a2332', fontSize: 12 },
      formatter: (params: any) => {
        const p = params[0];
        const wg = sorted[p.dataIndex];
        return `<div style="font-weight:600">${wg.name}组</div>
                <div style="color:#5a6a7f">负责人: ${wg.leader}</div>
                <div style="color:#5a6a7f">成员: ${wg.members.join('、')}</div>
                <div style="color:#5a6a7f">当前任务: ${wg.currentTasks}个</div>
                ${wg.vehiclePlate ? `<div style="color:#5a6a7f">车辆: ${wg.vehiclePlate}</div>` : ''}`;
      },
    },
    grid: {
      left: 20,
      right: 60,
      top: 10,
      bottom: 10,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#eef0f4', type: 'dashed' } },
      axisLabel: { color: '#8a96a8', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: sorted.map(w => w.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#5a6a7f', fontSize: 12 },
    },
    series: [
      {
        type: 'bar',
        data: sorted.map(w => ({
          value: w.currentTasks,
          itemStyle: {
            color: getBarColor(w.currentTasks),
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: 20,
        label: {
          show: true,
          position: 'right',
          formatter: '{c}',
          color: '#5a6a7f',
          fontSize: 12,
        },
      },
    ],
  };

  const handleChartClick = (params: any) => {
    if (params?.dataIndex !== undefined) {
      onWorkgroupClick(sorted[params.dataIndex].name);
    }
  };

  return (
    <div className="dash-card p-5 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--dash-text)' }}>
          工作组任务负载
        </h3>
        <button
          onClick={() => onWorkgroupClick('')}
          className="text-xs font-medium hover:underline"
          style={{ color: 'var(--dash-primary)' }}
        >
          查看全部
        </button>
      </div>
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
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 pt-2" style={{ borderTop: '1px solid var(--dash-border-light)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#43a047' }} />
          <span className="text-xs" style={{ color: 'var(--dash-text-muted)' }}>空闲 (0-3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#1a6bfe' }} />
          <span className="text-xs" style={{ color: 'var(--dash-text-muted)' }}>正常 (4-8)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#ff8f00' }} />
          <span className="text-xs" style={{ color: 'var(--dash-text-muted)' }}>繁忙 (9+)</span>
        </div>
      </div>
    </div>
  );
}
