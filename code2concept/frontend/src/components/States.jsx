import React from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center animate-fade-in">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-muted)', border: '1px dashed var(--border-strong)' }}>
        <Sparkles size={20} style={{ color: 'var(--text-subtle)' }} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>Ready to visualize</h3>
        <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: 'var(--text-muted)' }}>
          Select a snippet or paste your code, then click <strong>Visualize</strong>
        </p>
      </div>
    </div>
  );
}

export function LoadingState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16 animate-fade-in">
      <div className="spinner w-8 h-8" />
      <div className="text-center">
        <p className="text-sm font-medium cursor-blink" style={{ color: 'var(--text)' }}>{message}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Powered by Groq AI</p>
      </div>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center animate-fade-in">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fef2f2' }}>
        <AlertTriangle size={18} style={{ color: '#ef4444' }} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>Analysis failed</h3>
        <p className="text-xs max-w-xs leading-relaxed font-mono" style={{ color: '#ef4444' }}>{message}</p>
      </div>
    </div>
  );
}
