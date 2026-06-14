// src/pages/ComparePage.jsx
import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useCompare } from '../hooks/useCompare';
import { LoadingState, ErrorState } from '../components/States';
import CodeMetrics from '../components/compare/CodeMetrics';
import VerdictCard from '../components/compare/VerdictCard';

const LANGUAGES = [
  'python','javascript','typescript','java','c++','c',
  'go','rust','ruby','php','swift','kotlin','c#',
];

function EditorPane({ label, code, setCode, lang, setLang }) {
  const isA = label === 'A';
  const accentColor = isA ? '#3b82f6' : '#8b5cf6';
  return (
    <div className="card overflow-hidden flex flex-col flex-1 min-w-0" style={{ minHeight: 300 }}>
      {/* Pane header — matches your existing card headers in App.jsx */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}>
        <span className="text-xs font-medium font-mono" style={{ color: accentColor }}>
          Code {label}
        </span>
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          className="text-xs px-2 py-1 rounded-md outline-none cursor-pointer capitalize"
          style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text)' }}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Textarea */}
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder={`Paste Code ${label} here...`}
        spellCheck={false}
        className="flex-1 w-full p-4 text-sm font-mono resize-none outline-none"
        style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: 260 }}
      />

      {/* Footer */}
      <div className="px-4 py-1.5 border-t text-right"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}>
        <span className="text-xs font-mono" style={{ color: 'var(--text-subtle)' }}>
          {code.length} chars
        </span>
      </div>
    </div>
  );
}

export default function ComparePage({ onBack }) {
  const [code1, setCode1] = useState('');
  const [lang1, setLang1] = useState('python');
  const [code2, setCode2] = useState('');
  const [lang2, setLang2] = useState('python');

  const { result, loading, error, loadingMsg, compare, reset } = useCompare();

  const bothFilled = code1.trim().length > 0 && code2.trim().length > 0;

  function handleCompare() {
    if (!bothFilled) return;
    compare(code1, lang1, code2, lang2);
  }

  function handleReset() {
    reset();
    setCode1('');
    setCode2('');
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header — matches your pt-20 pb-6 pattern */}
      <div className="pt-20 pb-6 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#3b82f6' }}>Code</span>
          <span style={{ color: 'var(--text-muted)' }} className="mx-3">vs</span>
          <span style={{ color: '#8b5cf6' }}>Code</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Paste two snippets and get a full breakdown with a clear winner
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-4">

        {/* Dual editors */}
        <div className="flex flex-col lg:flex-row gap-3">
          <EditorPane label="A" code={code1} setCode={setCode1} lang={lang1} setLang={setLang1} />

          {/* VS badge */}
          <div className="flex lg:flex-col items-center justify-center">
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full"
              style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              VS
            </span>
          </div>

          <EditorPane label="B" code={code2} setCode={setCode2} lang={lang2} setLang={setLang2} />
        </div>

        {/* Action bar — matches your card p-2 controls row in App.jsx */}
        <div className="card p-2 flex items-center gap-2">
          <button
            onClick={handleCompare}
            disabled={!bothFilled || loading}
            className="btn-primary px-5 py-2 flex items-center gap-2">
            <Play size={13} />
            {loading ? 'Comparing...' : 'Compare'}
          </button>

          {(result || error) && (
            <button onClick={handleReset}
              className="btn-ghost px-4 py-2 flex items-center gap-2 text-sm">
              <RotateCcw size={13} /> Reset
            </button>
          )}

          {!bothFilled && !loading && (
            <span className="text-xs font-mono ml-2" style={{ color: 'var(--text-subtle)' }}>
              Fill both editors to compare
            </span>
          )}
        </div>

        {/* Results */}
        {loading && <LoadingState message={loadingMsg} />}
        {!loading && error && <ErrorState message={error} />}

        {!loading && result && (
          <div className="space-y-3">
            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-xs uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>
                Analysis
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            {/* Side by side metrics */}
            <div className="flex flex-col lg:flex-row gap-3">
              <CodeMetrics label="A" data={result.code1_analysis} />
              <CodeMetrics label="B" data={result.code2_analysis} />
            </div>

            {/* Verdict */}
            {result.verdict && <VerdictCard verdict={result.verdict} />}
          </div>
        )}
      </div>
    </div>
  );
}
