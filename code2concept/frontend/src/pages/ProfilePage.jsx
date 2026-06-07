import React, { useState, useEffect } from 'react';
import { ArrowLeft, Code2, Clock, Trash2, LogOut, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage({ onBack }) {
  const { user, token, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHistory(); }, []);

  async function fetchHistory() {
    try {
      const res = await fetch('https://code2concept-backend.onrender.com/history', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setHistory(await res.json());
    } catch {} finally { setLoading(false); }
  }

  async function deleteItem(id) {
    await fetch(`https://code2concept-backend.onrender.com/history/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setHistory(h => h.filter(x => x.id !== id));
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm mb-6 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={15} /> Back
        </button>

        {/* Profile */}
        <div className="card p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-semibold flex-shrink-0"
              style={{ background: 'var(--brand)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>{user?.name}</h2>
              <p className="text-sm flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                <Mail size={12} /> {user?.email}
              </p>
            </div>
            <button onClick={() => { logout(); onBack?.(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 transition-colors"
              style={{ border: '1px solid #fecaca' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <LogOut size={13} /> Sign out
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Total', value: history.length },
              { label: 'This week', value: history.filter(h => new Date(h.created_at) > new Date(Date.now()-7*864e5)).length },
              { label: 'Languages', value: [...new Set(history.map(h=>{try{return JSON.parse(h.result).language}catch{return null}}).filter(Boolean))].length },
            ].map((s,i) => (
              <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <p className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}>
            <h3 className="text-sm font-medium" style={{ color: 'var(--text)' }}>History</h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-10"><div className="spinner w-7 h-7" /></div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>No visualizations yet</div>
          ) : (
            <div>
              {history.map((h, i) => {
                let result = {};
                try { result = JSON.parse(h.result); } catch {}
                return (
                  <div key={h.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${i < history.length-1 ? 'border-b' : ''}`}
                    style={{ borderColor: 'var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-light)' }}>
                      <Code2 size={14} style={{ color: 'var(--brand)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{result.name || 'Unnamed'}</p>
                      <p className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-mono" style={{ background: 'var(--bg-muted)', padding: '1px 6px', borderRadius: 4 }}>{result.language || 'unknown'}</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{new Date(h.created_at).toLocaleDateString()}</span>
                      </p>
                    </div>
                    <button onClick={() => deleteItem(h.id)} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-red-400 transition-colors"
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
