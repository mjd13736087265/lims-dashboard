import { useState, useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import { getAreaStats } from '@/data/mockData';
import { STATUS_CONFIG } from '@/types/dashboard';
import { MapPin, Users, Building2, BarChart3 } from 'lucide-react';

type ViewMode = 'chart' | 'list';

interface AreaDistributionProps {
  onAreaClick: (areaName: string) => void;
  onClientClick: (clientName: string) => void;
}

export default function AreaDistribution({ onAreaClick, onClientClick }: AreaDistributionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const areaStats = useMemo(() => getAreaStats(), []);

  const sortedByTasks = [...areaStats].sort((a, b) => b.taskCount - a.taskCount);

  const statusKeys = ['pending_assign', 'pending_sample', 'sampling', 'transporting', 'completed'];
  const statusNames: Record<string, string> = {
    pending_assign: '待分配', pending_sample: '待采样', sampling: '采样中', transporting: '运输中', completed: '已完结',
  };

  const yAxisData = sortedByTasks.map(a => a.fullName);

  const series = statusKeys.map(status => ({
    name: statusNames[status],
    type: 'bar' as const,
    stack: 'total',
    barWidth: 28,
    data: sortedByTasks.map(area => area.statusDistribution[status] || 0),
    itemStyle: {
      color: STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.color || '#999',
      borderRadius: status === statusKeys[statusKeys.length - 1] ? [0, 4, 4, 0] : 0,
    },
  }));

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#ffffff',
      borderColor: '#E4E7ED',
      borderWidth: 1,
      textStyle: { color: '#595959', fontSize: 12 },
      formatter: (params: any) => {
        const areaIdx = params[0]?.dataIndex;
        const area = sortedByTasks[areaIdx];
        if (!area) return '';
        let html = `<div style="font-weight:600;margin-bottom:6px">${area.fullName}</div>`;
        html += `<div style="color:#64748B;font-size:11px;margin-bottom:4px">客户: ${area.clients.join('、')}</div>`;
        params.forEach((p: any) => {
          if (p.value > 0) {
            html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
              <span style="width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
              <span style="flex:1">${p.seriesName}</span>
              <span style="font-weight:600">${p.value}个</span>
            </div>`;
          }
        });
        html += `<div style="border-top:1px solid #E2E8F0;margin-top:4px;padding-top:4px;display:flex;justify-content:space-between">
          <span style="color:#94A3B8">任务: ${area.taskCount}</span>
        </div>`;
        return html;
      },
    },
    legend: {
      data: statusKeys.map(k => statusNames[k]),
      top: 0,
      right: 80,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 12,
      textStyle: { color: '#8C8C8C', fontSize: 11 },
    },
    grid: { left: 10, right: 30, top: 36, bottom: 10, containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#E4E7ED', type: 'dashed' } },
      axisLabel: { color: '#8C8C8C', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748B', fontSize: 12, fontWeight: 500 },
    },
    series,
  };

  return (
    <div className="dash-card p-5 animate-fade-in-up stagger-6" style={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <MapPin size={16} style={{ color: '#1677FF' }} />
          <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#262626' }}>受检方区域分布</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full data-highlight"
            style={{ background: '#E6F4FF', color: '#1677FF' }}>
            {areaStats.length}个区域
          </span>
        </div>
        <div className="segmented-control">
          <button onClick={() => setViewMode('chart')} className={`segmented-item flex items-center gap-1 ${viewMode === 'chart' ? 'active' : ''}`}>
            <BarChart3 size={11} /> 图表
          </button>
          <button onClick={() => setViewMode('list')} className={`segmented-item flex items-center gap-1 ${viewMode === 'list' ? 'active' : ''}`}>
            <Building2 size={11} /> 详情
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <ReactEChartsCore echarts={echarts} option={option} style={{ height: 260 }} notMerge={true} lazyUpdate={true} />
          </div>
          <div className="col-span-2 space-y-3">
            {sortedByTasks.slice(0, 4).map((area, idx) => (
              <button key={area.fullName} onClick={() => onAreaClick(area.fullName)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors hover:opacity-80"
                style={{ background: '#FFFFFF', border: '1px solid #D9D9D9' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold data-highlight"
                  style={{
                    background: ['rgba(34,197,94,0.1)', 'rgba(34,211,238,0.1)', 'rgba(167,139,250,0.1)', 'rgba(245,158,11,0.1)'][idx],
                    color: ['#52C41A', '#13C2C2', '#722ED1', '#FA8C16'][idx],
                  }}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: '#262626' }}>{area.fullName}</span>
                    <span className="text-sm font-bold data-highlight" style={{ color: '#1677FF' }}>{area.taskCount}个任务</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs flex items-center gap-1" style={{ color: '#8C8C8C' }}>
                      <Building2 size={10} />{area.taskCount}个任务
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: '#8C8C8C' }}>
                      <Users size={10} />{area.clientCount}个客户
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sortedByTasks.map(area => (
            <div key={area.fullName} className="p-4 rounded-lg transition-colors hover:border-opacity-50"
              style={{ border: '1px solid #D9D9D9', background: '#FFFFFF' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: '#1677FF' }} />
                  <span className="text-sm font-semibold" style={{ color: '#262626' }}>{area.fullName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: '#8C8C8C' }}>{area.taskCount}个任务</span>
                  <span className="text-xs font-bold data-highlight" style={{ color: '#1677FF' }}>{area.taskCount}个任务</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-3 h-2">
                {statusKeys.map(status => {
                  const count = area.statusDistribution[status] || 0;
                  if (count === 0) return null;
                  const total = area.projectCount;
                  const pct = (count / total) * 100;
                  return (
                    <div key={status} className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.color }}
                      title={`${statusNames[status]}: ${count}`} />
                  );
                })}
              </div>
              <div className="space-y-2">
                {area.clients.map(clientName => (
                  <button key={clientName} onClick={() => onClientClick(clientName)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors hover:opacity-80">
                    <span className="text-xs" style={{ color: '#595959' }}>{clientName}</span>
                    <span className="text-xs font-medium" style={{ color: '#8C8C8C' }}>
                      {areaStats.find(a => a.clients.includes(clientName))?.taskCount || 0} 任务
                    </span>
                  </button>
                ))}
              </div>
              <button onClick={() => onAreaClick(area.fullName)}
                className="w-full mt-3 text-center text-xs font-medium py-1.5 rounded-md transition-colors"
                style={{ color: '#1677FF', background: '#E6F4FF' }}>
                查看该区域所有任务
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
