import { useEffect, useRef, useState } from 'react';
import type { StatusCount } from '@/types/dashboard';

interface StatusPipelineProps {
  data: StatusCount[];
  totalTasks: number;
  onCardClick: (status: string) => void;
  onTotalClick: () => void;
}

function AnimatedNumber({ target, duration = 800 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span className="font-mono-data">{current}</span>;
}

export default function StatusPipeline({ data, totalTasks, onCardClick, onTotalClick }: StatusPipelineProps) {
  return (
    <div className="grid grid-cols-5 gap-4 animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
      {/* Total tasks - blue gradient card */}
      <button onClick={onTotalClick} className="text-left p-5 cursor-pointer transition-opacity hover:opacity-90 rounded-lg"
        style={{ background: 'linear-gradient(135deg, #1677FF 0%, #36A2FF 100%)' }}>
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>采样任务总数</span>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-3xl font-medium font-mono-data text-white">
            <AnimatedNumber target={totalTasks} />
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>个</span>
        </div>
        <span className="text-[11px] mt-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>本月新增 12 个</span>
      </button>

      {/* 4 status cards */}
      {data.map((item) => (
        <button
          key={item.status}
          onClick={() => onCardClick(item.status)}
          className="dash-card dash-card-hover text-left p-5 cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-medium" style={{ color: '#8C8C8C' }}>{item.label}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-medium font-mono-data" style={{ color: '#262626' }}>
              <AnimatedNumber target={item.count} />
            </span>
            <span className="text-xs" style={{ color: '#8C8C8C' }}>个</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium font-mono-data"
              style={{ color: item.dailyChange > 0 ? '#52C41A' : item.dailyChange < 0 ? '#F5222D' : '#8C8C8C' }}>
              {item.dailyChange > 0 ? '+' : ''}{item.dailyChange}
            </span>
            <span className="text-[11px]" style={{ color: '#8C8C8C' }}>较昨日</span>
          </div>
          <div className="mt-3 h-[2px] rounded-full" style={{ background: '#E4E7ED' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ backgroundColor: item.color, width: `${Math.min(100, (item.count / 50) * 100)}%` }} />
          </div>
        </button>
      ))}
    </div>
  );
}
