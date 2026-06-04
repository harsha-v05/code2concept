import React, { useState } from 'react';
import { Lightbulb, List, GitBranch, Code2, ChevronRight, Clock, Layers, Terminal } from 'lucide-react';
import FlowDiagram from './FlowDiagram';
import OutputPanel from './OutputPanel';

const TABS = [
  { id: 'diagram', label: 'Diagram', icon: GitBranch },
  { id: 'steps', label: 'Steps', icon: List },
  { id: 'output', label: 'Output', icon: Terminal },
  { id: 'raw', label: 'JSON', icon: Code2 },
];

export default function ResultPanel({ result, dark, vizMode, code, language }) {
  const [activeTab, setActiveTab] = useState('diagram');
  const [activeStep, setActiveStep] = useState(null);

  if (!result) return null;

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      {/* Info card */}
      <div className="rounded-xl p-4" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold tracking-tight" style={{ color: 'var(--text)' }}>{result.name}</h2>
            <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--text-muted)' }}>{result.description}</p>
          </div>
          {result.language && (
            <span className="badge badge-muted flex-shrink-0 font-mono">{result.language}</span>
          )}
        </div>

        {/* Complexity */}
        <div className="flex flex-wrap gap-2 mt-3">
          {result.time_complexity && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium font-mono" style={{ background: '#fef3c7', color: '#92400e' }}>
              <Clock size={11} /> Time: {result.time_complexity}
            </span>
          )}
          {result.space_complexity && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium font-mono" style={{ background: '#eff6ff', color: '#1e40af' }}>
              <Layers size={11} /> Space: {result.space_complexity}
            </span>
          )}
        </div>

        {/* Concepts */}
        {result.key_concepts?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {result.key_concepts.map((c, i) => (
              <span key={i} className="badge badge-brand text-xs">{c}</span>
            ))}
          </div>
        )}

        {/* Tip */}
        {result.tips && (
          <div className="flex gap-2 mt-3 p-2.5 rounded-lg text-xs leading-relaxed" style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#78350f' }}>
            <Lightbulb size={13} className="flex-shrink-0 mt-0.5" />
            {result.tips}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="flex border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all border-b-2"
                style={{
                  borderColor: activeTab === tab.id ? 'var(--brand)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--brand)' : 'var(--text-muted)',
                  background: activeTab === tab.id ? 'var(--bg)' : 'transparent',
                }}>
                <Icon size={12} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4" style={{ background: 'var(--bg)' }}>
          {activeTab === 'diagram' && (
            <div className="flex flex-col gap-4">
              <FlowDiagram steps={result.steps} name={result.name} dark={dark} vizMode={vizMode} result={result} />
              {/* Steps below diagram */}
              {result.steps?.length > 0 && (
                <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Step-by-step breakdown</p>
                  <ol className="flex flex-col gap-2">
                    {result.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 items-start p-3 rounded-lg cursor-pointer transition-all"
                        style={{ background: activeStep === i ? 'var(--brand-light)' : 'var(--bg-subtle)', border: `1px solid ${activeStep === i ? 'var(--brand)' : 'var(--border)'}` }}
                        onClick={() => setActiveStep(activeStep === i ? null : i)}>
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5 text-white"
                          style={{ background: activeStep === i ? 'var(--brand-dark)' : 'var(--brand)' }}>
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{step.title}</p>
                          {activeStep === i && <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>}
                          {step.code_ref && activeStep === i && (
                            <span className="inline-block mt-1.5 text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-muted)', color: 'var(--brand)' }}>{step.code_ref}</span>
                          )}
                        </div>
                        <ChevronRight size={13} className="flex-shrink-0 mt-0.5 transition-transform" style={{ color: 'var(--text-subtle)', transform: activeStep === i ? 'rotate(90deg)' : 'none' }} />
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {activeTab === 'steps' && (
            <ol className="flex flex-col gap-2">
              {result.steps?.map((step, i) => (
                <li key={i} className="flex gap-3 items-start p-3.5 rounded-lg" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white" style={{ background: 'var(--brand)' }}>{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{step.title}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                    {step.code_ref && <span className="inline-block mt-1.5 text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-muted)', color: 'var(--brand)' }}>{step.code_ref}</span>}
                  </div>
                </li>
              ))}
            </ol>
          )}

          {activeTab === 'output' && (
            <OutputPanel code={code} language={language} />
          )}

          {activeTab === 'raw' && (
            <pre className="text-xs font-mono leading-relaxed overflow-auto max-h-96 p-3 rounded-lg scrollbar-thin"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1px solid var(--border)' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
