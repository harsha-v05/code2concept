// src/components/compare/VerdictCard.jsx
export default function VerdictCard({ verdict }) {
  if (!verdict) return null;
  const { winner, reasoning, tradeoffs, recommendation } = verdict;
  const key = ['A', 'B'].includes(winner) ? winner : 'tie';

  const styles = {
    A:   { border: '1px solid #3b82f6', background: 'rgba(59,130,246,0.08)', badge: '#3b82f6' },
    B:   { border: '1px solid #8b5cf6', background: 'rgba(139,92,246,0.08)',  badge: '#8b5cf6' },
    tie: { border: '1px solid #f59e0b', background: 'rgba(245,158,11,0.08)',  badge: '#f59e0b' },
  }[key];

  return (
    <div className="rounded-xl p-5 space-y-4 mt-4"
      style={{ border: styles.border, background: styles.background }}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{key === 'tie' ? '🤝' : '🏆'}</span>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>Verdict</p>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            {key === 'tie' ? "It's a Tie" : `Code ${key} Wins`}
          </h3>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
          style={{ background: styles.badge }}>
          {key === 'tie' ? 'TIE' : `CODE ${key}`}
        </span>
      </div>

      {reasoning && (
        <div>
          <p className="text-xs uppercase tracking-widest font-mono mb-1" style={{ color: 'var(--text-muted)' }}>Why</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{reasoning}</p>
        </div>
      )}

      {tradeoffs && (
        <div>
          <p className="text-xs uppercase tracking-widest font-mono mb-1" style={{ color: 'var(--text-muted)' }}>Trade-offs</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tradeoffs}</p>
        </div>
      )}

      {recommendation && (
        <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs uppercase tracking-widest font-mono mb-1" style={{ color: 'var(--text-muted)' }}>Use this when</p>
          <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text)' }}>{recommendation}</p>
        </div>
      )}
    </div>
  );
}
