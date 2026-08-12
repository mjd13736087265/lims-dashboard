import { useState } from 'react';
import { RefreshCw, ChevronDown, CalendarDays } from 'lucide-react';
import { CLIENTS } from '@/types/dashboard';

interface HeaderProps {
  selectedClient: string;
  onClientChange: (client: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenCalendar: () => void;
}

export default function Header({ selectedClient, onClientChange, onRefresh, isRefreshing, onOpenCalendar }: HeaderProps) {
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [dateRange, setDateRange] = useState('近30天');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const dateOptions = ['近7天', '近30天', '本月', '本季度'];

  return (
    <header className="sticky top-0 z-50" style={{ background: 'linear-gradient(90deg, #1677FF 0%, #1890FF 100%)', height: 56 }}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <h1 className="text-base font-medium text-white tracking-tight">采样管理看板</h1>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded text-white" style={{ background: 'rgba(255,255,255,0.2)' }}>
            LIMS
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Client */}
          <div className="relative">
            <button onClick={() => setShowClientDropdown(!showClientDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.15)' }}>
              <span className="max-w-[120px] truncate">{selectedClient}</span>
              <ChevronDown size={13} />
            </button>
            {showClientDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowClientDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-xl z-50 py-1.5 overflow-hidden"
                  style={{ background: '#fff', border: '1px solid #E4E7ED' }}>
                  {CLIENTS.map(client => (
                    <button key={client} onClick={() => { onClientChange(client); setShowClientDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-sm transition-colors"
                      style={{ color: selectedClient === client ? '#1677FF' : '#595959', fontWeight: selectedClient === client ? 600 : 400, background: selectedClient === client ? '#E6F4FF' : 'transparent' }}>
                      {client}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Date */}
          <div className="relative">
            <button onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.15)' }}>
              <span>{dateRange}</span>
              <ChevronDown size={13} />
            </button>
            {showDateDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDateDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-32 rounded-lg shadow-xl z-50 py-1.5 overflow-hidden"
                  style={{ background: '#fff', border: '1px solid #E4E7ED' }}>
                  {dateOptions.map(opt => (
                    <button key={opt} onClick={() => { setDateRange(opt); setShowDateDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-sm transition-colors"
                      style={{ color: dateRange === opt ? '#1677FF' : '#595959', fontWeight: dateRange === opt ? 600 : 400, background: dateRange === opt ? '#E6F4FF' : 'transparent' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Calendar */}
          <button onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <CalendarDays size={14} />
            <span className="hidden sm:inline">采样日历</span>
          </button>

          {/* Refresh */}
          <button onClick={onRefresh} title="刷新数据"
            className="flex items-center justify-center w-8 h-8 rounded-md text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin-once' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
}
