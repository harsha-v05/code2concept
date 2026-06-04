import React, { useState } from 'react';
import { Play, Square, Terminal, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { runCode } from '../utils/runCode';

export default function OutputPanel({ code, language }) {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const [time, setTime] = useState(null);

  async function handleRun() {
    if (!code.trim()) return;
    setRunning(true);
    setOutput('');
    setError('');
    setRan(false);
    const start = Date.now();
    try {
      const result = await runCode(code, language);
      setTime(((Date.now() - start) / 1000).toFixed(2));
      setOutput(result.output || '');
      setError(result.error || '');
      setRan(true);
    } catch (e) {
      setTime(((Date.now() - start) / 1000).toFixed(2));
      setError(e.message || 'Execution failed');
      setRan(true);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Run button bar */}
      <div className="flex items-center justify-between p-3 rounded-xl"
        style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <Terminal size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Running: <span className="font-mono" style={{ color: 'var(--brand)' }}>{language || 'python'}</span>
          </span>
          {time && ran && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-subtle)' }}>
              <Clock size={11} /> {time}s
            </span>
          )}
        </div>
        <button
          onClick={handleRun}
          disabled={running || !code.trim()}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: running ? '#6b7280' : 'var(--brand)' }}>
          {running
            ? <><Square size={11} /> Running...</>
            : <><Play size={11} /> Run Code</>}
        </button>
      </div>

      {/* Output display */}
      {!ran && !running && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-12"
          style={{ border: '1px dashed var(--border)', borderRadius: 12 }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--bg-muted)' }}>
            <Terminal size={18} style={{ color: 'var(--text-subtle)' }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Click <strong>Run Code</strong> to execute</p>
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>Supports 30+ languages · No setup needed</p>
        </div>
      )}

      {running && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-12">
          <div className="spinner w-8 h-8" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Executing your code...</p>
        </div>
      )}

      {ran && !running && (
        <div className="flex flex-col gap-3 flex-1">
          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
            style={{
              background: error && !output ? '#fef2f2' : 'var(--brand-light)',
              border: `1px solid ${error && !output ? '#fecaca' : 'var(--brand)'}`,
              color: error && !output ? '#ef4444' : 'var(--brand-dark)',
            }}>
            {error && !output
              ? <><AlertCircle size={13} /> Execution failed</>
              : <><CheckCircle size={13} /> Executed successfully</>}
          </div>

          {/* Stdout */}
          {output && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Output</p>
              <pre className="text-xs font-mono leading-relaxed p-4 rounded-xl overflow-auto max-h-64 scrollbar-thin whitespace-pre-wrap"
                style={{ background: '#09090b', color: '#f4f4f5', border: '1px solid #27272a' }}>
                {output}
              </pre>
            </div>
          )}

          {/* Stderr */}
          {error && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium" style={{ color: '#ef4444' }}>Error</p>
              <pre className="text-xs font-mono leading-relaxed p-4 rounded-xl overflow-auto max-h-48 scrollbar-thin whitespace-pre-wrap"
                style={{ background: '#450a0a', color: '#fca5a5', border: '1px solid #7f1d1d' }}>
                {error}
              </pre>
            </div>
          )}

          {/* Empty output */}
          {!output && !error && (
            <div className="flex flex-col gap-2">
              <div className="px-3 py-2.5 rounded-lg text-xs leading-relaxed" style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                ✅ Program ran successfully but produced no output.<br/>
                <span style={{ color: 'var(--text-subtle)' }}>Tip: Add <code style={{fontFamily:'monospace', background:'var(--bg)', padding:'1px 4px', borderRadius:3}}>print()</code> statements to see output here.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
