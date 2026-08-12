import { useState } from 'react';
import { Medal, Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type TimeRange = 'day' | 'week' | 'month' | 'year' | 'total';

const rangeLabels: Record<TimeRange, string> = {
  day: '日', week: '周', month: '月', year: '年', total: '总',
};
const ranges: TimeRange[] = ['day', 'week', 'month', 'year', 'total'];

const fullRankingData: Record<TimeRange, { name: string; count: number; trend: number }[]> = {
  day: [
    { name: '王晓王', count: 3, trend: 1 }, { name: '张如强', count: 2, trend: 0 },
    { name: '赵伟', count: 2, trend: 1 }, { name: '毛金达', count: 1, trend: -1 },
    { name: '李迪', count: 1, trend: 0 }, { name: '陈明', count: 1, trend: 1 },
    { name: '周小红', count: 1, trend: 0 }, { name: '吴刚', count: 0, trend: -1 },
    { name: '郑丽', count: 0, trend: 0 }, { name: '孙涛', count: 0, trend: 0 },
    { name: '黄磊', count: 0, trend: 0 }, { name: '林静', count: 0, trend: 0 },
  ],
  week: [
    { name: '王晓王', count: 14, trend: 3 }, { name: '张如强', count: 11, trend: 2 },
    { name: '赵伟', count: 9, trend: 1 }, { name: '王小', count: 8, trend: -1 },
    { name: '刘喜龙', count: 7, trend: 0 }, { name: '陈明', count: 6, trend: 2 },
    { name: '周小红', count: 5, trend: -1 }, { name: '吴刚', count: 4, trend: 0 },
    { name: '郑丽', count: 3, trend: 1 }, { name: '孙涛', count: 3, trend: 0 },
    { name: '黄磊', count: 2, trend: -1 }, { name: '林静', count: 2, trend: 0 },
  ],
  month: [
    { name: '王晓王', count: 56, trend: 8 }, { name: '张如强', count: 48, trend: 5 },
    { name: '赵伟', count: 42, trend: 3 }, { name: '王小', count: 38, trend: -2 },
    { name: '刘喜龙', count: 35, trend: 4 }, { name: '陈明', count: 32, trend: 6 },
    { name: '周小红', count: 28, trend: -3 }, { name: '吴刚', count: 24, trend: 1 },
    { name: '郑丽', count: 20, trend: 2 }, { name: '孙涛', count: 18, trend: 0 },
    { name: '黄磊', count: 15, trend: -2 }, { name: '林静', count: 12, trend: 1 },
  ],
  year: [
    { name: '王晓王', count: 420, trend: 45 }, { name: '张如强', count: 385, trend: 32 },
    { name: '赵伟', count: 356, trend: 28 }, { name: '王小', count: 312, trend: 15 },
    { name: '刘喜龙', count: 298, trend: 22 }, { name: '陈明', count: 276, trend: 18 },
    { name: '周小红', count: 245, trend: -8 }, { name: '吴刚', count: 210, trend: 5 },
    { name: '郑丽', count: 185, trend: 12 }, { name: '孙涛', count: 168, trend: -3 },
    { name: '黄磊', count: 145, trend: 8 }, { name: '林静', count: 128, trend: -5 },
  ],
  total: [
    { name: '王晓王', count: 1286, trend: 120 }, { name: '张如强', count: 1152, trend: 95 },
    { name: '赵伟', count: 1086, trend: 88 }, { name: '王小', count: 956, trend: 62 },
    { name: '刘喜龙', count: 898, trend: 75 }, { name: '陈明', count: 845, trend: 55 },
    { name: '周小红', count: 768, trend: -20 }, { name: '吴刚', count: 689, trend: 32 },
    { name: '郑丽', count: 612, trend: 45 }, { name: '孙涛', count: 558, trend: -12 },
    { name: '黄磊', count: 486, trend: 28 }, { name: '林静', count: 425, trend: -18 },
  ],
};

export default function PersonnelTaskRanking() {
  const [range, setRange] = useState<TimeRange>('month');
  const [modalOpen, setModalOpen] = useState(false);

  const fullData = fullRankingData[range];
  const displayData = fullData.slice(0, 5);
  const maxCount = fullData[0].count;

  const getRankColor = (idx: number) => {
    if (idx === 0) return '#FA8C16';
    if (idx === 1) return '#94A3B8';
    if (idx === 2) return '#D48806';
    return '#8C8C8C';
  };

  return (
    <>
      <div className="dash-card p-5 animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={15} style={{ color: '#FA8C16' }} />
            <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#262626' }}>人员任务量排名</h3>
          </div>
          <div className="segmented-control">
            {ranges.map(key => (
              <button key={key} onClick={() => setRange(key)} className={`segmented-item ${range === key ? 'active' : ''}`}>
                {rangeLabels[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {displayData.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {idx < 3 ? (
                  <Medal size={15} style={{ color: getRankColor(idx) }} />
                ) : (
                  <span className="text-xs font-bold data-highlight" style={{ color: '#8C8C8C' }}>{idx + 1}</span>
                )}
              </div>
              <span className="text-sm font-medium w-14 flex-shrink-0" style={{ color: '#262626' }}>{item.name}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#E4E7ED' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  background: idx === 0 ? '#FA8C16' : idx === 1 ? '#262626' : '#1677FF',
                }} />
              </div>
              <span className="text-sm font-bold w-8 text-right data-highlight" style={{ color: '#262626' }}>{item.count}</span>
              <span className="text-[10px]" style={{ color: item.trend > 0 ? 'var(--dash-forest)' : item.trend < 0 ? '#F5222D' : '#8C8C8C' }}>
                {item.trend > 0 ? '+' : ''}{item.trend}
              </span>
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
              <Trophy size={16} style={{ color: '#FA8C16' }} />
              人员任务量排名 — {rangeLabels[range]}排行
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
                  {idx < 3 ? (
                    <Medal size={17} style={{ color: getRankColor(idx) }} />
                  ) : (
                    <span className="text-xs font-bold data-highlight" style={{ color: '#8C8C8C' }}>{idx + 1}</span>
                  )}
                </div>
                <span className="text-sm font-medium w-16 flex-shrink-0" style={{ color: '#262626' }}>{item.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#E4E7ED' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    background: idx === 0 ? '#FA8C16' : idx === 1 ? '#262626' : idx === 2 ? '#1677FF' : '#E4E7ED',
                  }} />
                </div>
                <span className="text-sm font-bold w-10 text-right data-highlight" style={{ color: '#262626' }}>{item.count}</span>
                <span className="text-[10px] w-8 text-right" style={{ color: item.trend > 0 ? 'var(--dash-forest)' : item.trend < 0 ? '#F5222D' : '#8C8C8C' }}>
                  {item.trend > 0 ? '+' : ''}{item.trend}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
