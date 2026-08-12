import { useEffect, useState, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

interface KpiCardsProps {
  onCardClick: (index: number) => void;
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

const cards = [
  { label: '超期任务数', value: 5, unit: '个', sub: '需重点关注', color: '#F5222D' },
  { label: '活跃任务数', value: 41, unit: '个', sub: '较昨日 +7', color: '#52C41A' },
  { label: '空闲人员数', value: 4, unit: '人', sub: '可分配任务', color: '#13C2C2' },
];

export default function KpiCards({ onCardClick }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
      {cards.map((item, index) => (
        <button key={item.label} onClick={() => onCardClick(index)}
          className="dash-card p-5 flex items-start gap-4 text-left cursor-pointer dash-card-hover">
          <div className="w-[3px] h-10 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: item.color }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium mb-1" style={{ color: '#8C8C8C' }}>{item.label}</p>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-medium font-mono-data" style={{ color: '#262626' }}>
                <AnimatedNumber target={item.value} />
              </span>
              <span className="text-xs" style={{ color: '#8C8C8C' }}>{item.unit}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px]" style={{ color: '#8C8C8C' }}>{item.sub}</p>
              <ChevronRight size={14} style={{ color: '#8C8C8C' }} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
