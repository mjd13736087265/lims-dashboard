import { useEffect, useState } from 'react';
import { X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { STATUS_CONFIG } from '@/types/dashboard';
import { tasks as allTasks, projects as allProjects, clientAreas } from '@/data/mockData';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  filterType: 'status' | 'workgroup' | 'project' | 'client' | 'area' | '';
  filterValue: string;
}

export default function DetailDrawer({ isOpen, onClose, title, filterType, filterValue }: DetailDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setSearchTerm('');
    }
  }, [isOpen]);

  // Filter tasks based on drawer context
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = searchTerm === '' ||
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskNo.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    switch (filterType) {
      case 'status':
        return task.status === STATUS_CONFIG[filterValue as keyof typeof STATUS_CONFIG]?.label;
      case 'workgroup':
        return task.workGroup === filterValue || (filterValue === '' && task.workGroup);
      case 'project':
        return task.projectId === filterValue;
      case 'client': {
        const project = allProjects.find(p => p.id === task.projectId);
        return project?.clientName === filterValue;
      }
      case 'area': {
        const areaClients = clientAreas
          .filter(ca => `${ca.city}${ca.district}` === filterValue)
          .map(ca => ca.clientName);
        const project = allProjects.find(p => p.id === task.projectId);
        return project ? areaClients.includes(project.clientName) : false;
      }
      default: {
        if (filterValue === 'active') return task.status !== '已完结';
        if (filterValue === 'overdue') {
          const project = allProjects.find(p => p.id === task.projectId);
          return project ? project.daysElapsed > 3 && project.status !== 'completed' : false;
        }
        if (filterValue === 'idle') return task.workGroup === '' || !task.workGroup;
        return true;
      }
    }
  });

  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="absolute right-0 top-0 h-full w-[480px] max-w-[90vw] shadow-xl flex flex-col"
        style={{
          background: '#F0F2F5',
          borderLeft: '1px solid #E4E7ED',
          animation: 'slideInRight 300ms ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E4E7ED' }}>
          <h3 className="text-base font-semibold" style={{ color: '#262626' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:opacity-80"
          >
            <X size={18} style={{ color: '#595959' }} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b" style={{ borderColor: '#E4E7ED' }}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8C8C8C' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="搜索任务编号或名称..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors focus:border-blue-400"
              style={{ borderColor: '#E4E7ED', color: '#262626' }}
            />
          </div>
        </div>

        {/* Task count */}
        <div className="px-5 py-2 text-xs" style={{ color: '#8C8C8C' }}>
          共 {filteredTasks.length} 个任务
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5">
          {paginatedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#F0F2F5' }}>
                <Search size={24} style={{ color: '#8C8C8C' }} />
              </div>
              <p className="text-sm" style={{ color: '#8C8C8C' }}>暂无任务数据</p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {paginatedTasks.map(task => {
                const project = allProjects.find(p => p.id === task.projectId);
                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg border transition-colors hover:opacity-80"
                    style={{ borderColor: '#E4E7ED' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#262626' }}>
                          {task.taskName}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#8C8C8C' }}>
                          {task.taskNo}
                        </p>
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded flex-shrink-0 ml-2"
                        style={{
                          backgroundColor: `${STATUS_CONFIG[Object.keys(STATUS_CONFIG).find(k => STATUS_CONFIG[k as keyof typeof STATUS_CONFIG].label === task.status) as keyof typeof STATUS_CONFIG]?.color || '#999'}15`,
                          color: STATUS_CONFIG[Object.keys(STATUS_CONFIG).find(k => STATUS_CONFIG[k as keyof typeof STATUS_CONFIG].label === task.status) as keyof typeof STATUS_CONFIG]?.color || '#999',
                        }}
                      >
                        {task.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span style={{ color: '#8C8C8C' }}>所属项目: </span>
                        <span style={{ color: '#262626' }}>{task.projectName}</span>
                      </div>
                      <div>
                        <span style={{ color: '#8C8C8C' }}>客户: </span>
                        <span style={{ color: '#262626' }}>{project?.clientName || '-'}</span>
                      </div>
                      <div>
                        <span style={{ color: '#8C8C8C' }}>检测类别: </span>
                        <span style={{ color: '#262626' }}>{task.detectCategory}</span>
                      </div>
                      <div>
                        <span style={{ color: '#8C8C8C' }}>点位: </span>
                        <span style={{ color: '#262626' }}>{task.pointNo} ({task.pointName})</span>
                      </div>
                      {task.workGroup && (
                        <div>
                          <span style={{ color: '#8C8C8C' }}>工作组: </span>
                          <span style={{ color: '#262626' }}>{task.workGroup}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: '#E4E7ED' }}>
            <span className="text-xs" style={{ color: '#8C8C8C' }}>
              第 {currentPage}/{totalPages} 页
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-7 h-7 rounded transition-colors hover:opacity-80 disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-7 h-7 rounded transition-colors hover:opacity-80 disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
