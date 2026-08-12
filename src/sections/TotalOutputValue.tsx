import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'total';

const rangeLabels: Record<TimeRange, string> = {
  day: '日', week: '周', month: '月', year: '年', total: '总',
};
const ranges: TimeRange[] = ['day', 'week', 'month', 'year', 'total'];

const PERSONNEL_COUNT = 20;

const compareData: Record<TimeRange, {
  current: number; previous: number; currentLabel: string; previousLabel: string;
  taskCount: number; avgDailyOutput: number;
}> = {
  day: { current: 48500, previous: 43100, currentLabel: '今日', previousLabel: '昨日', taskCount: 3, avgDailyOutput: Math.round(48500 / PERSONNEL_COUNT) },
  week: { current: 286000, previous: 264000, currentLabel: '本周', previousLabel: '上周', taskCount: 18, avgDailyOutput: Math.round(286000 / PERSONNEL_COUNT / 5) },
  month: { current: 1186000, previous: 1025000, currentLabel: '本月', previousLabel: '上月', taskCount: 86, avgDailyOutput: Math.round(1186000 / PERSONNEL_COUNT / 22) },
  year: { current: 8960000, previous: 7320000, currentLabel: '今年', previousLabel: '去年', taskCount: 652, avgDailyOutput: Math.round(8960000 / PERSONNEL_COUNT / 250) },
  total: { current: 15680000, previous: 0, currentLabel: '累计', previousLabel: '', taskCount: 1120, avgDailyOutput: Math.round(15680000 / PERSONNEL_COUNT / 750) },
};

export default function TotalOutputValue() {
  const [range, setRange] = useState<TimeRange>('month');
  const data = compareData[range];

  const formatAmount = (num: number) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    return num.toLocaleString();
  };

  const changePct = data.previous > 0 ? ((data.current - data.previous) / data.previous * 100).toFixed(1) : '0';
  const isUp = Number(changePct) > 0;
  const isFlat = Number(changePct) === 0;

  const maxVal = Math.max(data.current, data.previous || data.current);
  const currentHeight = maxVal > 0 ? (data.current / maxVal) * 100 : 0;
  const previousHeight = data.previous > 0 ? (data.previous / maxVal) * 100 : 0;

  return (
    <div className="dash-card p-5 animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign size={16} style={{ color: 'var(--dash-forest)' }} />
          <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#262626' }}>总产值统计</h3>
        </div>
        <div className="segmented-control">
          {ranges.map(key => (
            <button key={key} onClick={() => setRange(key)} className={`segmented-item ${range === key ? 'active' : ''}`}>
              {rangeLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Main value */}
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-bold data-highlight" style={{ color: 'var(--dash-forest)' }}>
          ¥{formatAmount(data.current)}
        </span>
        {data.previous > 0 && (
          <span className="text-xs font-medium mb-1 flex items-center gap-0.5" style={{ color: isUp ? 'var(--dash-forest)' : isFlat ? '#8C8C8C' : '#F5222D' }}>
            {isUp ? <TrendingUp size={12} /> : isFlat ? <Minus size={12} /> : <TrendingDown size={12} />}
            {isUp ? '+' : ''}{changePct}%
          </span>
        )}
      </div>

      {/* Sub stats */}
      <div className="flex items-center gap-4 text-xs mb-3" style={{ color: '#8C8C8C' }}>
        <span>涉及 <strong className="data-highlight" style={{ color: '#262626' }}>{data.taskCount}</strong> 个任务</span>
        <span>人均产值 <strong className="data-highlight" style={{ color: '#262626' }}>¥{formatAmount(Math.round(data.current / PERSONNEL_COUNT))}</strong></span>
      </div>

      {/* 人均日产值 */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg mb-4" style={{ background: 'rgba(24,29,38,0.06)' }}>
        <Users size={13} style={{ color: '#262626' }} />
        <span className="text-xs" style={{ color: '#8C8C8C' }}>人均日产值</span>
        <span className="text-sm font-bold data-highlight" style={{ color: '#262626' }}>¥{data.avgDailyOutput.toLocaleString()}</span>
        <span className="text-[10px]" style={{ color: '#8C8C8C' }}>/ 人 / 天</span>
      </div>

      {/* Compare bar chart */}
      {range !== 'total' ? (
        <div>
          <div className="flex items-end justify-center gap-8 h-20 mb-2">
            <div className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] font-medium data-highlight" style={{ color: '#8C8C8C' }}>¥{formatAmount(data.previous)}</span>
              <div className="w-10 rounded-t-md transition-all duration-500" style={{ height: `${previousHeight}%`, minHeight: 4, background: '#E4E7ED' }} />
              <span className="text-[10px]" style={{ color: '#8C8C8C' }}>{data.previousLabel}</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] font-bold data-highlight" style={{ color: 'var(--dash-forest)' }}>¥{formatAmount(data.current)}</span>
              <div className="w-10 rounded-t-md transition-all duration-500" style={{ height: `${currentHeight}%`, minHeight: 4, background: 'var(--dash-forest)' }} />
              <span className="text-[10px] font-bold" style={{ color: '#262626' }}>{data.currentLabel}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-[10px]" style={{ color: '#8C8C8C' }}>环比</span>
            <span className="text-[10px] font-bold data-highlight" style={{ color: isUp ? 'var(--dash-forest)' : '#F5222D' }}>{isUp ? '+' : ''}{changePct}%</span>
          </div>
        </div>
      ) : (
        <div className="mt-2 pt-3" style={{ borderTop: '1px solid #E4E7ED' }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2.5 rounded-lg" style={{ background: 'rgba(24,29,38,0.06)' }}>
              <div className="text-lg font-bold data-highlight" style={{ color: 'var(--dash-forest)' }}>{data.taskCount}</div>
              <div className="text-[10px]" style={{ color: '#8C8C8C' }}>累计任务数</div>
            </div>
            <div className="text-center p-2.5 rounded-lg" style={{ background: 'rgba(24,29,38,0.06)' }}>
              <div className="text-lg font-bold data-highlight" style={{ color: 'var(--dash-forest)' }}>¥{formatAmount(Math.round(data.current / data.taskCount))}</div>
              <div className="text-[10px]" style={{ color: '#8C8C8C' }}>平均任务产值</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
