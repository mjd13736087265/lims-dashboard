import type { WorkGroup } from '@/types/dashboard';
import { CheckCircle2 } from 'lucide-react';

interface IdleWorkgroupsProps {
  workGroups: WorkGroup[];
  onWorkgroupClick: (name: string) => void;
}

export default function IdleWorkgroups({ workGroups, onWorkgroupClick }: IdleWorkgroupsProps) {
  const idleGroups = workGroups.filter(wg => wg.currentTasks <= 3);

  return (
    <div className="dash-card p-5 animate-fade-in-up stagger-6" style={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--dash-text)' }}>
          空闲工作组
        </h3>
        <span
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(67, 160, 71, 0.1)', color: 'var(--dash-green)' }}
        >
          {idleGroups.length}个空闲
        </span>
      </div>

      <div className="space-y-3">
        {idleGroups.map(wg => (
          <button
            key={wg.id}
            onClick={() => onWorkgroupClick(wg.name)}
            className="w-full text-left flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-50"
            style={{ backgroundColor: 'var(--dash-bg)' }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold" style={{ color: 'var(--dash-text)' }}>
                  {wg.name}组
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: 'rgba(67, 160, 71, 0.1)', color: 'var(--dash-green)' }}
                >
                  可分配
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--dash-text-muted)' }}>
                <span>负责人: {wg.leader}</span>
                {wg.vehiclePlate && (
                  <>
                    <span>·</span>
                    <span>{wg.vehiclePlate}</span>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {wg.members.slice(0, 4).map(m => (
                  <span
                    key={m}
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: 'var(--dash-card)', color: 'var(--dash-text-secondary)' }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 ml-3 flex-shrink-0">
              <CheckCircle2 size={14} style={{ color: 'var(--dash-green)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--dash-green)' }}>
                {wg.currentTasks}个任务
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
