import { useState, useMemo } from 'react';
import type { Project } from '@/types/dashboard';
import { STATUS_CONFIG } from '@/types/dashboard';
import { AlertTriangle, Eye, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface OverdueProjectsProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
}

const PAGE_SIZE = 5;

export default function OverdueProjects({ projects }: OverdueProjectsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const allOverdue = useMemo(() => {
    return projects.filter(p => p.daysElapsed > 3 && p.status !== 'completed').sort((a, b) => b.daysElapsed - a.daysElapsed);
  }, [projects]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return allOverdue.filter(p => {
      const matchSearch = !s || p.name.toLowerCase().includes(s) || p.projectNo.toLowerCase().includes(s) || p.clientName.toLowerCase().includes(s);
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [allOverdue, search, statusFilter]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleStatus = (val: string) => { setStatusFilter(val); setPage(1); };

  const statusOptions = [
    { key: '', label: '全部状态' }, { key: 'pending_assign', label: '待分配' },
    { key: 'pending_sample', label: '待采样' }, { key: 'sampling', label: '采样中' }, { key: 'transporting', label: '运输中' },
  ];

  return (
    <div className="dash-card p-5" style={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#262626' }}>持续多天未完结任务</h3>
          <span className="text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 data-highlight"
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#F5222D' }}>
            <AlertTriangle size={11} />{totalItems}个任务超期
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8C8C8C' }} />
            <input type="text" value={search} onChange={e => handleSearch(e.target.value)}
              placeholder="搜索名称/编号/受检方..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none w-44"
              style={{ borderColor: '#E4E7ED', color: '#262626', background: '#F0F2F5' }} />
          </div>
          <select value={statusFilter} onChange={e => handleStatus(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border outline-none cursor-pointer"
            style={{ borderColor: '#E4E7ED', color: '#595959', background: '#F0F2F5' }}>
            {statusOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #E4E7ED' }}>
              {['任务编号', '任务名称', '受检单位', '状态', '点位数', '委托日期', '截止日期', '已持续', '操作'].map(h => (
                <th key={h} className="text-left py-3 px-3 text-xs font-semibold tracking-wider"
                  style={{ color: '#8C8C8C', background: '#F0F2F5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={9} className="py-12 text-center text-sm" style={{ color: '#8C8C8C' }}>暂无数据</td></tr>
            ) : (
              paginated.map(project => {
                const sc = STATUS_CONFIG[project.status];
                return (
                  <tr key={project.id} className="transition-colors"
                    style={{ borderBottom: '1px solid #E4E7ED' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F0F2F5')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="py-3 px-3 text-sm font-medium data-highlight" style={{ color: '#1677FF' }}>{project.projectNo}</td>
                    <td className="py-3 px-3 text-sm max-w-[180px] truncate" style={{ color: '#262626' }}>{project.name}</td>
                    <td className="py-3 px-3 text-sm" style={{ color: '#595959' }}>{project.clientName}</td>
                    <td className="py-3 px-3">
                      <span className="status-badge" style={{ background: `${sc.color}15`, color: sc.color }}>
                        <span className="status-dot" style={{ backgroundColor: sc.color }} />{sc.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm font-medium data-highlight" style={{ color: '#262626' }}>{project.taskCount}</td>
                    <td className="py-3 px-3 text-xs" style={{ color: '#8C8C8C' }}>{project.entrustDate}</td>
                    <td className="py-3 px-3 text-xs" style={{ color: '#8C8C8C' }}>{project.deadline}</td>
                    <td className="py-3 px-3">
                      <span className="text-sm font-bold data-highlight" style={{ color: project.daysElapsed > 14 ? '#F5222D' : '#FA8C16' }}>
                        {project.daysElapsed}天
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80" style={{ color: '#262626' }}>
                        <Eye size={12} />查看
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid #E4E7ED' }}>
          <span className="text-xs" style={{ color: '#8C8C8C' }}>共 {totalItems} 条，第 {currentPage}/{totalPages} 页</span>
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
      )}
    </div>
  );
}
