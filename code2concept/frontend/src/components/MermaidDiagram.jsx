import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { AlertTriangle } from 'lucide-react';

let mermaidReady = false;

function initMermaid(dark) {
  mermaid.initialize({
    startOnLoad: false,
    theme: dark ? 'dark' : 'neutral',
    flowchart: { htmlLabels: true, curve: 'basis', padding: 20 },
    themeVariables: dark
      ? {
          primaryColor: '#1D4030',
          primaryTextColor: '#9FE1CB',
          primaryBorderColor: '#1D9E75',
          lineColor: '#5DCAA5',
          secondaryColor: '#232320',
          tertiaryColor: '#2C2C2A',
          background: '#1A1A18',
          mainBkg: '#1D4030',
          nodeBorder: '#1D9E75',
          clusterBkg: '#232320',
          titleColor: '#9FE1CB',
          edgeLabelBackground: '#2C2C2A',
          fontFamily: 'Syne, sans-serif',
        }
      : {
          primaryColor: '#E1F5EE',
          primaryTextColor: '#0F6E56',
          primaryBorderColor: '#1D9E75',
          lineColor: '#1D9E75',
          secondaryColor: '#F1EFE8',
          tertiaryColor: '#E6F1FB',
          fontFamily: 'Syne, sans-serif',
        },
    securityLevel: 'loose',
  });
  mermaidReady = true;
}

export default function MermaidDiagram({ code, dark }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [svg, setSvg] = useState('');

  useEffect(() => {
    initMermaid(dark);
  }, [dark]);

  useEffect(() => {
    if (!code || !containerRef.current) return;
    setError(null);

    const render = async () => {
      try {
        const id = `mermaid-${Date.now()}`;
        let cleaned = code.trim();
        if (cleaned.startsWith('graph') || cleaned.startsWith('flowchart')) {
          cleaned = cleaned.replace(/->>>/g, '-->').replace(/->>/g, '-->');
        }
        const { svg: rendered } = await mermaid.render(id, cleaned);
        setSvg(rendered);
      } catch (e) {
        setError(e.message || 'Failed to render diagram');
        setSvg('');
      }
    };

    render();
  }, [code, dark]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <AlertTriangle size={18} className="text-red-500" />
        </div>
        <p className="text-sm text-surface-dark2 dark:text-surface-2 font-medium">Could not render diagram</p>
        <p className="text-xs text-surface-dark3/60 dark:text-surface-3/50 max-w-xs font-mono">{error}</p>
        <details className="text-left mt-2">
          <summary className="text-xs text-brand-500 cursor-pointer">Show raw diagram code</summary>
          <pre className="mt-2 text-xs font-mono bg-surface-2 dark:bg-surface-dark2 p-3 rounded-lg overflow-auto max-h-40 text-surface-dark0 dark:text-surface-1">
            {code}
          </pre>
        </details>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container flex justify-center items-center overflow-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
