import { useState } from 'react';
import { Crown, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'total';

const rangeLabels: Record<TimeRange, string> = {
  day: '日', week: '周', month: '月', year: '年', total: '总',
};
const ranges: TimeRange[] = ['day', 'week', 'month', 'year', 'total'];

const fullRankingData: Record<TimeRange, { name: string; output: number; taskCount: number }[]> = {
  day: [
    { name: '王晓王', output: 28500, taskCount: 3 }, { name: '张如强', output: 18600, taskCount: 2 },
    { name: '赵伟', output: 15200, taskCount: 2 }, { name: '毛金达', output: 8500, taskCount: 1 },
    { name: '李迪', output: 7200, taskCount: 1 }, { name: '陈明', output: 6800, taskCount: 1 },
    { name: '周小红', output: 5200, taskCount: 1 },
  ],
  week: [
    { name: '王晓王', output: 168000, taskCount: 14 }, { name: '张如强', output: 132000, taskCount: 11 },
    { name: '赵伟', output: 98500, taskCount: 9 }, { name: '王小', output: 87600, taskCount: 8 },
    { name: '刘喜龙', output: 72400, taskCount: 7 }, { name: '陈明', output: 65800, taskCount: 6 },
    { name: '周小红', output: 48600, taskCount: 5 },
  ],
  month: [
    { name: '王晓王', output: 586000, taskCount: 56 }, { name: '张如强', output: 462000, taskCount: 48 },
    { name: '赵伟', output: 398000, taskCount: 42 }, { name: '王小', output: 356000, taskCount: 38 },
    { name: '刘喜龙', output: 312000, taskCount: 35 }, { name: '陈明', output: 286000, taskCount: 32 },
    { name: '周小红', output: 228000, taskCount: 28 },
  ],
  year: [
    { name: '王晓王', output: 4860000, taskCount: 420 }, { name: '张如强', output: 3980000, taskCount: 385 },
    { name: '赵伟', output: 3560000, taskCount: 356 }, { name: '王小', output: 2980000, taskCount: 312 },
    { name: '刘喜龙', output: 2650000, taskCount: 298 }, { name: '陈明', output: 2360000, taskCount: 276 },
    { name: '周小红', output: 1980000, taskCount: 245 },
  ],
  total: [
    { name: '王晓王', output: 8960000, taskCount: 786 }, { name: '张如强', output: 7230000, taskCount: 652 },
    { name: '赵伟', output: 6580000, taskCount: 598 }, { name: '王小', output: 5120000, taskCount: 465 },
    { name: '刘喜龙', output: 4680000, taskCount: 420 }, { name: '陈明', output: 4250000, taskCount: 385 },
    { name: '周小红', output: 3680000, taskCount: 342 },
  ],
};

export default function PersonnelOutputRanking() {
  const [range, setRange] = useState<TimeRange>('month');
  const [modalOpen, setModalOpen] = useState(false);

  const fullData = fullRankingData[range];
  const displayData = fullData.slice(0, 5);
  const maxOutput = fullData[0].output;

  const formatAmount = (num: number) => {
    if (num >= 10000) return `${(num / 10000).toFixed(0)}万`;
    return num.toLocaleString();
  };

  return (
    <>
      <div className="dash-card p-5 animate-fade-in-up stagger-6" style={{ opacity: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown size={15} style={{ color: '#FA8C16' }} />
            <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#262626' }}>人员产值排名</h3>
          </div>
          <div className="segmented-control">
            {ranges.map(key => (
              <button key={key} onClick={() => setRange(key)} className={`segmented-item ${range === key ? 'active' : ''}`}>
                {rangeLabels[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {displayData.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg"
              style={{ background: idx < 3 ? ['rgba(245,158,11,0.06)', 'rgba(59,130,246,0.05)', 'rgba(34,211,238,0.04)'][idx] : 'transparent' }}>
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold data-highlight" style={{ color: idx < 3 ? ['#FA8C16', '#1677FF', '#13C2C2'][idx] : '#8C8C8C' }}>
                  {idx + 1}
                </span>
              </div>
              <span className="text-sm font-medium w-14 flex-shrink-0" style={{ color: '#262626' }}>{item.name}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold data-highlight" style={{ color: idx < 3 ? ['#FA8C16', '#1677FF', '#13C2C2'][idx] : '#262626' }}>
                    ¥{formatAmount(item.output)}
                  </span>
                  <span className="text-[10px]" style={{ color: '#8C8C8C' }}>{item.taskCount}个任务</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E4E7ED' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{
                    width: `${(item.output / maxOutput) * 100}%`,
                    background: idx < 3 ? ['#FA8C16', '#1677FF', '#13C2C2'][idx] : '#1677FF',
                  }} />
                </div>
              </div>
              <TrendingUp size={12} style={{ color: idx < 3 ? ['#FA8C16', '#1677FF', '#13C2C2'][idx] : '#8C8C8C' }} />
            </div>
          ))}
        </div>

        <button onClick={() => setModalOpen(true)} className="w-full mt-3 py-2 text-xs font-medium rounded-lg border transition-colors hover:opacity-80"
          style={{ borderColor: '#E4E7ED', color: '#262626', background: 'transparent' }}>
          查看全部 {fullData.length} 人
        </button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col" style={{ background: '#F0F2F5', borderColor: '#E4E7ED' }}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-sm" style={{ color: '#262626' }}>
              <Crown size={16} style={{ color: '#FA8C16' }} />
              人员产值排名 — {rangeLabels[range]}排行
            </DialogTitle>
          </DialogHeader>
          <div className="segmented-control flex-shrink-0 mb-2">
            {ranges.map(key => (
              <button key={key} onClick={() => setRange(key)} className={`segmented-item flex-1 ${range === key ? 'active' : ''}`}>
                {rangeLabels[key]}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {fullData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-3 p-2.5 rounded-lg"
                style={{ background: idx < 3 ? ['rgba(245,158,11,0.06)', 'rgba(59,130,246,0.05)', 'rgba(34,211,238,0.04)'][idx] : 'transparent' }}>
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold data-highlight" style={{ color: idx < 3 ? ['#FA8C16', '#1677FF', '#13C2C2'][idx] : '#8C8C8C' }}>
                    {idx + 1}
                  </span>
                </div>
                <span className="text-sm font-medium w-16 flex-shrink-0" style={{ color: '#262626' }}>{item.name}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold data-highlight" style={{ color: idx < 3 ? ['#FA8C16', '#1677FF', '#13C2C2'][idx] : '#262626' }}>
                      ¥{formatAmount(item.output)}
                    </span>
                    <span className="text-[10px]" style={{ color: '#8C8C8C' }}>{item.taskCount}个任务</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E4E7ED' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{
                      width: `${(item.output / maxOutput) * 100}%`,
                      background: idx === 0 ? '#FA8C16' : idx === 1 ? '#262626' : idx === 2 ? '#1677FF' : '#E4E7ED',
                    }} />
                  </div>
                </div>
                <TrendingUp size={12} style={{ color: idx < 3 ? ['#FA8C16', '#1677FF', '#13C2C2'][idx] : '#8C8C8C' }} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
