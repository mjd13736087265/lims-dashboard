import { useState } from 'react';
import { projectLeaders } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Info } from 'lucide-react';

interface LeaderLoadProps {
  onLeaderClick: (name: string) => void;
}

const surnameColors: Record<string, string> = {
  '王': '#1677FF', '张': '#52C41A', '赵': '#FA8C16', '刘': '#F5222D',
  '陈': '#722ED1', '李': '#13C2C2', '周': '#EB2F96', '吴': '#FA541C',
  '郑': '#237804', '孙': '#531dab', '黄': '#d4380d', '林': '#0958D9',
};

function getSurnameColor(surname: string): string {
  return surnameColors[surname] || '#1677FF';
}

function getLoadLevel(activeTasks: number): { label: string; color: string; bg: string } {
  if (activeTasks <= 3) return { label: '轻度', color: '#52C41A', bg: '#F6FFED' };
  if (activeTasks <= 6) return { label: '中度', color: '#FA8C16', bg: '#FFF7E6' };
  return { label: '重度', color: '#F5222D', bg: '#FFF1F0' };
}

const LOAD_STANDARDS = [
  { label: '轻度', desc: '在途任务 ≤ 3', color: '#52C41A', bg: '#F6FFED' },
  { label: '中度', desc: '在途任务 4~6', color: '#FA8C16', bg: '#FFF7E6' },
  { label: '重度', desc: '在途任务 ≥ 7', color: '#F5222D', bg: '#FFF1F0' },
];

export default function LeaderLoad({ onLeaderClick }: LeaderLoadProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // 按在途任务数升序排列（轻度在前，方便监管人员优先看到可派任务的人员）
  const sorted = [...projectLeaders].sort((a, b) => a.activeTasks - b.activeTasks);
  const maxActive = Math.max(...projectLeaders.map(l => l.activeTasks), 1);

  return (
    <>
      <div className="dash-card p-5 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold" style={{ color: '#262626' }}>人员任务负载</h3>
          <button onClick={() => setModalOpen(true)}
            className="text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: '#1677FF' }}>
            查看全部
          </button>
        </div>

        <div className="space-y-3">
          {sorted.slice(0, 5).map((leader) => {
            const surname = leader.name.charAt(0);
            const color = getSurnameColor(surname);
            const level = getLoadLevel(leader.activeTasks);
            const pct = (leader.activeTasks / maxActive) * 100;

            return (
              <div key={leader.name} onClick={() => onLeaderClick(leader.name)}
                className="flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium text-white"
                  style={{ background: color }}>
                  {surname}
                </div>
                <span className="text-sm font-medium w-16 flex-shrink-0" style={{ color: '#262626' }}>
                  {leader.name}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#F0F2F5' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: level.color, opacity: 0.7 }} />
                </div>
                <span className="text-sm font-semibold font-mono-data w-10 text-right" style={{ color: '#262626' }}>
                  {leader.activeTasks}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded flex-shrink-0"
                  style={{ color: level.color, background: level.bg }}>
                  {level.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 负载评判标准 */}
        <div className="mt-4 pt-3 flex items-center gap-4" style={{ borderTop: '1px solid #E4E7ED' }}>
          <div className="flex items-center gap-1" style={{ color: '#8C8C8C' }}>
            <Info size={12} />
            <span className="text-[11px]">负载标准：</span>
          </div>
          {LOAD_STANDARDS.map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded" style={{ color: s.color, background: s.bg }}>
                {s.label}
              </span>
              <span className="text-[11px]" style={{ color: '#8C8C8C' }}>{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 全部人员弹窗 */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
          style={{ background: '#FFFFFF', borderColor: '#E4E7ED' }}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-sm" style={{ color: '#262626' }}>
              全部人员任务负载
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-2">
            {sorted.map((leader) => {
              const surname = leader.name.charAt(0);
              const color = getSurnameColor(surname);
              const level = getLoadLevel(leader.activeTasks);
              const pct = (leader.activeTasks / maxActive) * 100;

              return (
                <div key={leader.name}
                  onClick={() => { onLeaderClick(leader.name); setModalOpen(false); }}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors"
                  style={{ background: '#F8FAFC' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium text-white"
                    style={{ background: color }}>
                    {surname}
                  </div>
                  <span className="text-sm font-medium w-16 flex-shrink-0" style={{ color: '#262626' }}>
                    {leader.name}
                  </span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: '#F0F2F5' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: level.color, opacity: 0.7 }} />
                  </div>
                  <span className="text-sm font-semibold font-mono-data w-10 text-right" style={{ color: '#262626' }}>
                    {leader.activeTasks}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded flex-shrink-0"
                    style={{ color: level.color, background: level.bg }}>
                    {level.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 弹窗底部标准 */}
          <div className="flex-shrink-0 mt-3 pt-3 flex items-center gap-4" style={{ borderTop: '1px solid #E4E7ED' }}>
            <div className="flex items-center gap-1" style={{ color: '#8C8C8C' }}>
              <Info size={12} />
              <span className="text-[11px]">负载标准：</span>
            </div>
            {LOAD_STANDARDS.map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded" style={{ color: s.color, background: s.bg }}>
                  {s.label}
                </span>
                <span className="text-[11px]" style={{ color: '#8C8C8C' }}>{s.desc}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
