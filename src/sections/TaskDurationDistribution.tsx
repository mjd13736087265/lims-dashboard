import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import type { Project } from '@/types/dashboard';

interface TaskDurationDistributionProps {
  tasks: Project[];
  onSliceClick: (durationRange: string) => void;
}

export default function TaskDurationDistribution({ tasks, onSliceClick }: TaskDurationDistributionProps) {
  const buckets = [
    { key: '1d', label: '1天', count: 0, color: '#52C41A' },
    { key: '2d', label: '2天', count: 0, color: '#13C2C2' },
    { key: '3d', label: '3天', count: 0, color: '#1677FF' },
    { key: '4-5d', label: '4-5天', count: 0, color: '#722ED1' },
    { key: '6-7d', label: '6-7天', count: 0, color: '#F5222D' },
    { key: '8-14d', label: '8-14天', count: 0, color: '#FA8C16' },
    { key: '15-21d', label: '15-21天', count: 0, color: '#d97706' },
    { key: '22-30d', label: '22-30天', count: 0, color: '#92400e' },
    { key: '30d+', label: '30天以上', count: 0, color: '#1677FF' },
  ];

  tasks.forEach(t => {
    const days = t.daysElapsed || 1;
    if (days === 1) buckets[0].count++;
    else if (days === 2) buckets[1].count++;
    else if (days === 3) buckets[2].count++;
    else if (days <= 5) buckets[3].count++;
    else if (days <= 7) buckets[4].count++;
    else if (days <= 14) buckets[5].count++;
    else if (days <= 21) buckets[6].count++;
    else if (days <= 30) buckets[7].count++;
    else buckets[8].count++;
  });

  const data = buckets
    .filter(b => b.count > 0)
    .map(b => ({
      name: b.label,
      value: b.count,
      itemStyle: { color: b.color },
    }));

  const total = tasks.length;

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#E4E7ED',
      borderWidth: 1,
      textStyle: { color: '#595959', fontSize: 12 },
      formatter: (params: any) => {
        return `<div style="font-weight:600">${params.name}</div>
                <div style="color:#94A3B8">${params.value} 个任务 (${params.percent}%)</div>`;
      },
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 12,
      textStyle: { color: '#8C8C8C', fontSize: 11 },
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
          borderColor: '#ffffff',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#F0F2F5' },
          itemStyle: { shadowBlur: 20, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
        labelLine: { show: false },
        data,
        selectedMode: 'single',
      },
    ],
  };

  const handleChartClick = (params: any) => {
    if (params?.name) onSliceClick(params.name);
  };

  return (
    <div className="dash-card p-5 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#262626' }}>
          任务持续天数分布
        </h3>
      </div>
      <div className="relative">
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: 280 }}
          onEvents={{ click: handleChartClick }}
          notMerge={true}
          lazyUpdate={true}
        />
        {/* Center text overlay */}
        <div
          className="absolute flex flex-col items-center justify-center pointer-events-none"
          style={{ left: '38%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <span className="text-3xl font-medium leading-none font-mono-data" style={{ color: '#262626' }}>
            {total}
          </span>
          <span className="text-xs mt-1" style={{ color: '#8C8C8C' }}>个任务</span>
        </div>
      </div>
    </div>
  );
}
