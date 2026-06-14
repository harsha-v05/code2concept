// src/components/compare/CodeMetrics.jsx
function ScoreBar({ label, value }) {
  const pct = Math.min(Math.max(value * 10, 0), 100);
  const color = value >= 8 ? '#10b981' : value >= 5 ? '#f59e0b' : '#ef4444';
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span className="text-xs font-bold font-mono" style={{ color }}>{value}/10</span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-muted)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function CodeMetrics({ label, data }) {
  if (!data) return null;
  const isA = label === 'A';
  const accentColor = isA ? '#3b82f6' : '#8b5cf6';
  const tagStyle = { background: isA ? 'rgba(59,130,246,0.15)' : 'rgba(139,92,246,0.15)', color: accentColor };
  const borderStyle = { border: `1px solid ${isA ? 'rgba(59,130,246,0.3)' : 'rgba(139,92,246,0.3)'}`, background: 'var(--bg-subtle)' };

  const { language, time_complexity, space_complexity, readability_score,
    maintainability_score, strengths = [], weaknesses = [], bugs = [], use_cases = [] } = data;

  return (
    <div className="rounded-xl p-4 space-y-4 flex-1 min-w-0" style={borderStyle}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-bold font-mono text-sm" style={{ color: accentColor }}>Code {label}</h4>
        {language && (
          <span className="text-xs px-2 py-0.5 rounded-full font-mono capitalize" style={tagStyle}>{language}</span>
        )}
      </div>

      {/* Complexity pills */}
      <div className="grid grid-cols-2 gap-2">
        {time_complexity && (
          <div className="rounded-lg p-2.5 text-center" style={{ background: 'var(--bg-muted)' }}>
            <p className="text-xs font-mono mb-0.5" style={{ color: 'var(--text-muted)' }}>Time</p>
            <p className="text-xs font-bold font-mono" style={{ color: 'var(--text)' }}>{time_complexity}</p>
          </div>
        )}
        {space_complexity && (
          <div className="rounded-lg p-2.5 text-center" style={{ background: 'var(--bg-muted)' }}>
            <p className="text-xs font-mono mb-0.5" style={{ color: 'var(--text-muted)' }}>Space</p>
            <p className="text-xs font-bold font-mono" style={{ color: 'var(--text)' }}>{space_complexity}</p>
          </div>
        )}
      </div>

      {/* Score bars */}
      {readability_score != null && <ScoreBar label="Readability" value={readability_score} />}
      {maintainability_score != null && <ScoreBar label="Maintainability" value={maintainability_score} />}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>Strengths</p>
          <ul className="space-y-1">
            {strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-xs" style={{ color: 'var(--text)' }}>
                <span style={{ color: '#10b981' }}>✓</span>{s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>Weaknesses</p>
          <ul className="space-y-1">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex gap-2 text-xs" style={{ color: 'var(--text)' }}>
                <span style={{ color: '#f59e0b' }}>⚠</span>{w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bugs */}
      {bugs.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>Issues</p>
          <ul className="space-y-1">
            {bugs.map((b, i) => (
              <li key={i} className="flex gap-2 text-xs" style={{ color: '#ef4444' }}>
                <span>✗</span>{b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Use cases */}
      {use_cases.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>Best for</p>
          <div className="flex flex-wrap gap-1">
            {use_cases.map((u, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={tagStyle}>{u}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
