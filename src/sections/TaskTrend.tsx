import { useState, useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts';
import { generateTrendData } from '@/data/mockData';

export default function TaskTrend() {
  const [granularity, setGranularity] = useState<'day' | 'week'>('day');

  const trendData = useMemo(() => generateTrendData(), []);

  const { dates, seriesData } = useMemo(() => {
    if (granularity === 'day') {
      return { dates: trendData.dates, seriesData: trendData.series };
    }
    const weekDates: string[] = [];
    const weekSeries: Record<string, number[]> = {
      pending_assign: [],
      pending_sample: [],
      sampling: [],
      transporting: [],
    };
    const keys = Object.keys(trendData.series) as Array<keyof typeof trendData.series>;
    for (let i = 0; i < trendData.dates.length; i += 7) {
      weekDates.push(`W${Math.floor(i / 7) + 1}`);
      keys.forEach(key => {
        const slice = trendData.series[key].slice(i, i + 7);
        const avg = Math.round(slice.reduce((a, b) => a + b, 0) / slice.length);
        weekSeries[key].push(avg);
      });
    }
    return { dates: weekDates, seriesData: weekSeries };
  }, [granularity, trendData]);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#E4E7ED',
      borderWidth: 1,
      textStyle: { color: '#595959', fontSize: 12 },
      axisPointer: {
        type: 'cross',
        crossStyle: { color: '#E4E7ED' },
      },
    },
    legend: {
      data: ['待分配', '待采样', '采样中', '运输中'],
      top: 0,
      right: 0,
      itemWidth: 12,
      itemHeight: 3,
      textStyle: { color: '#8C8C8C', fontSize: 11 },
    },
    grid: {
      left: 10,
      right: 20,
      top: 40,
      bottom: 10,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#E4E7ED' } },
      axisTick: { show: false },
      axisLabel: { color: '#64748B', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#E4E7ED', type: 'dashed' } },
      axisLabel: { color: '#8C8C8C', fontSize: 10 },
    },
    series: [
      {
        name: '待分配',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#FA8C16' },
        areaStyle: { color: 'rgba(245, 158, 11, 0.06)' },
        data: seriesData.pending_assign,
      },
      {
        name: '待采样',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#13C2C2' },
        areaStyle: { color: 'rgba(34, 211, 238, 0.06)' },
        data: seriesData.pending_sample,
      },
      {
        name: '采样中',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#52C41A' },
        areaStyle: { color: 'rgba(34, 197, 94, 0.06)' },
        data: seriesData.sampling,
      },
      {
        name: '运输中',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#722ED1' },
        areaStyle: { color: 'rgba(167, 139, 250, 0.06)' },
        data: seriesData.transporting,
      },
    ],
  };

  return (
    <div className="dash-card p-5 animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#262626' }}>
          近30天任务状态趋势
        </h3>
        <div className="segmented-control">
          <button
            onClick={() => setGranularity('day')}
            className={`segmented-item ${granularity === 'day' ? 'active' : ''}`}
          >
            日
          </button>
          <button
            onClick={() => setGranularity('week')}
            className={`segmented-item ${granularity === 'week' ? 'active' : ''}`}
          >
            周
          </button>
        </div>
      </div>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ height: 280 }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}
