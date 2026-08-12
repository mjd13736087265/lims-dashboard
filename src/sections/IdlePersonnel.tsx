import { useState } from 'react';
import { allPersonnel } from '@/data/mockData';
import { Phone, UserCircle, X, Users } from 'lucide-react';

interface IdlePersonnelProps {
  onPersonClick: (name: string) => void;
}

export default function IdlePersonnel({ onPersonClick }: IdlePersonnelProps) {
  const idlePersons = allPersonnel.filter(p => p.currentTasks === 0);
  const showInCard = idlePersons.slice(0, 3);
  const hasMore = idlePersons.length > 3;
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="dash-card p-4 animate-fade-in-up stagger-6" style={{ opacity: 0 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-wide" style={{ color: '#262626' }}>空闲人员</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full data-highlight"
              style={{ background: 'rgba(24,29,38,0.06)', color: 'var(--dash-forest)' }}>
              {idlePersons.length}人
            </span>
          </div>
          {hasMore && (
            <button onClick={() => setShowModal(true)} className="text-xs font-medium transition-colors hover:opacity-80" style={{ color: '#262626' }}>
              查看全部
            </button>
          )}
        </div>

        <div className="space-y-2">
          {showInCard.map(person => (
            <button key={person.id} onClick={() => onPersonClick(person.name)}
              className="w-full text-left flex items-center gap-2.5 p-2 rounded-lg transition-colors hover:opacity-80"
              style={{ background: 'rgba(24,29,38,0.06)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(27,97,201,0.06)' }}>
                <UserCircle size={14} style={{ color: '#1677FF' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: '#262626' }}>{person.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium data-highlight"
                    style={{ background: 'rgba(24,29,38,0.06)', color: 'var(--dash-forest)' }}>
                    空闲
                  </span>
                </div>
              </div>
              <Phone size={11} style={{ color: '#8C8C8C' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Full list modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0" style={{ background: 'rgba(2, 6, 23, 0.7)' }} onClick={() => setShowModal(false)} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] max-w-[90vw] rounded-xl shadow-2xl overflow-hidden"
            style={{ animation: 'modalIn 200ms ease-out', background: '#F0F2F5', border: '1px solid #E4E7ED' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E4E7ED' }}>
              <div className="flex items-center gap-2">
                <Users size={16} style={{ color: 'var(--dash-forest)' }} />
                <h3 className="text-sm font-semibold" style={{ color: '#262626' }}>空闲人员</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full data-highlight"
                  style={{ background: 'rgba(24,29,38,0.06)', color: 'var(--dash-forest)' }}>
                  {idlePersons.length}人
                </span>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: '#595959' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E4E7ED')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
              {idlePersons.map(person => (
                <div key={person.id} className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: 'rgba(24,29,38,0.06)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(27,97,201,0.06)' }}>
                    <UserCircle size={16} style={{ color: '#1677FF' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: '#262626' }}>{person.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium data-highlight"
                        style={{ background: 'rgba(24,29,38,0.06)', color: 'var(--dash-forest)' }}>
                        空闲
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs" style={{ color: '#8C8C8C' }}>{person.role}</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: '#8C8C8C' }}>
                        <Phone size={9} />{person.phone}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style>{`@keyframes modalIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }`}</style>
        </div>
      )}
    </>
  );
}
