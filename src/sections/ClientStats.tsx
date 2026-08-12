import { useState, useMemo } from 'react';
import type { ClientStats as ClientStatsType } from '@/types/dashboard';
import { STATUS_CONFIG } from '@/types/dashboard';
import { Eye, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

type SortKey = 'projectCount' | 'totalTasks';
type SortDir = 'asc' | 'desc';

interface ClientStatsProps {
  data: ClientStatsType[];
  onClientClick: (clientName: string) => void;
}

const PAGE_SIZE = 5;

export default function ClientStats({ data, onClientClick }: ClientStatsProps) {
  const [sortKey, setSortKey] = useState<SortKey>('totalTasks');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const statusKeys = ['pending_assign', 'pending_sample', 'sampling', 'transporting', 'completed'];

  const processed = useMemo(() => {
    const s = search.trim().toLowerCase();
    const arr = data.filter(c => !s || c.clientName.toLowerCase().includes(s));
    arr.sort((a, b) => sortDir === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]);
    return arr;
  }, [data, search, sortKey, sortDir]);

  const totalItems = processed.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginated = processed.slice(startIdx, startIdx + PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(p => p === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  return (
    <div className="dash-card p-5" style={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#262626' }}>客户采样统计</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8C8C8C' }} />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="搜索客户..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none w-40"
              style={{ borderColor: '#E4E7ED', color: '#262626', background: '#F0F2F5' }} />
          </div>
          <button onClick={() => handleSort('projectCount')}
            className="flex items-center gap-1 text-xs px-2 py-1.5 rounded transition-colors"
            style={{ background: sortKey === 'projectCount' ? 'rgba(27,97,201,0.06)' : '#F0F2F5', color: sortKey === 'projectCount' ? '#1677FF' : '#8C8C8C', border: '1px solid #E4E7ED' }}>
            <ArrowUpDown size={10} />按任务数
          </button>
          <button onClick={() => handleSort('totalTasks')}
            className="flex items-center gap-1 text-xs px-2 py-1.5 rounded transition-colors"
            style={{ background: sortKey === 'totalTasks' ? 'rgba(27,97,201,0.06)' : '#F0F2F5', color: sortKey === 'totalTasks' ? '#1677FF' : '#8C8C8C', border: '1px solid #E4E7ED' }}>
            <ArrowUpDown size={10} />按总任务
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #E4E7ED' }}>
              {['客户名称', '任务数量', '任务总数', '待分配', '待采样', '采样中', '运输中', '已完结', '操作'].map(h => (
                <th key={h} className="text-left py-3 px-3 text-xs font-semibold tracking-wider"
                  style={{ color: '#8C8C8C', background: '#F0F2F5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={9} className="py-12 text-center text-sm" style={{ color: '#8C8C8C' }}>暂无数据</td></tr>
            ) : (
              paginated.map(client => (
                <tr key={client.clientName} className="transition-colors"
                  style={{ borderBottom: '1px solid #E4E7ED' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F0F2F5')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="py-3 px-3 text-sm font-medium" style={{ color: '#262626' }}>{client.clientName}</td>
                  <td className="py-3 px-3 text-sm font-semibold data-highlight" style={{ color: '#262626' }}>{client.projectCount}</td>
                  <td className="py-3 px-3 text-sm font-bold data-highlight" style={{ color: '#1677FF' }}>{client.totalTasks}</td>
                  {statusKeys.map(key => (
                    <td key={key} className="py-3 px-3">
                      <span className="text-xs px-2 py-1 rounded font-medium data-highlight"
                        style={{
                          background: `${STATUS_CONFIG[key as keyof typeof STATUS_CONFIG].color}15`,
                          color: STATUS_CONFIG[key as keyof typeof STATUS_CONFIG].color,
                        }}>
                        {client.statusDistribution[key] || 0}
                      </span>
                    </td>
                  ))}
                  <td className="py-3 px-3">
                    <button onClick={() => onClientClick(client.clientName)}
                      className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80" style={{ color: '#262626' }}>
                      <Eye size={12} />查看任务
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid #E4E7ED' }}>
        <span className="text-xs" style={{ color: '#8C8C8C' }}>共 {totalItems} 条{totalPages > 1 ? `，第 ${currentPage}/${totalPages} 页` : ''}</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30"
              style={{ color: '#595959' }}
              onMouseEnter={e => { if (currentPage !== 1) e.currentTarget.style.background = '#E4E7ED'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors"
                style={{ background: p === currentPage ? '#262626' : 'transparent', color: p === currentPage ? '#262626' : '#595959' }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded transition-colors disabled:opacity-30"
              style={{ color: '#595959' }}
              onMouseEnter={e => { if (currentPage !== totalPages) e.currentTarget.style.background = '#E4E7ED'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
