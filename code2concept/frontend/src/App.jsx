import React, { useState, useEffect } from 'react';
import { Play, ChevronDown, GitCompare } from 'lucide-react';  // added GitCompare
import Navbar from './components/Navbar';
import CodeEditor from './components/CodeEditor';
import ResultPanel from './components/ResultPanel';
import ExportShare from './components/ExportShare';
import { EmptyState, LoadingState, ErrorState } from './components/States';
import { useAnalyze } from './hooks/useAnalyze';
import { useAuth } from './context/AuthContext';
import { SNIPPETS, VIZ_MODES } from './utils/snippets';
import { detectLanguage } from './utils/detectLanguage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import ComparePage from './pages/ComparePage';   // ← NEW

const SNIPPET_KEYS = Object.keys(SNIPPETS);

export default function App() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [code, setCode] = useState(SNIPPETS.stack.code);
  const [activeSnippet, setActiveSnippet] = useState('stack');
  const [vizMode, setVizMode] = useState('flowchart');
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState('login');
  const [showProfile, setShowProfile] = useState(false);
  const [showCompare, setShowCompare] = useState(false);   // ← NEW

  const { result, loading, error, loadingMsg, analyze } = useAnalyze();
  const { user, token, loading: authLoading } = useAuth();

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);

  function handleSnippet(key) { setActiveSnippet(key); setCode(SNIPPETS[key].code); }

  async function handleVisualize() {
    const res = await analyze(code, vizMode);
    if (user && token && res) {
      try {
        await fetch('https://code2concept-backend.onrender.com/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ code, viz_mode: vizMode, result: JSON.stringify(res) }),
        });
      } catch {}
    }
  }

  const currentLang = detectLanguage(code) || SNIPPETS[activeSnippet]?.language || 'python';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="spinner w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className={dark ? 'dark' : ''}>
          <LandingPage
            onLogin={() => { setLoginMode('login'); setShowLogin(true); }}
            onSignup={() => { setLoginMode('signup'); setShowLogin(true); }}
          />
        </div>
        {showLogin && <LoginPage initialMode={loginMode} onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  if (showProfile) return <ProfilePage onBack={() => setShowProfile(false)} />;

  // ── NEW: Compare page ──────────────────────────────────────────
  if (showCompare) {
    return (
      <>
        <Navbar
          dark={dark}
          onToggleDark={() => setDark(d => !d)}
          onLoginClick={() => setShowLogin(true)}
          onProfileClick={() => setShowProfile(true)}
          onCompareClick={() => setShowCompare(false)}   // back to analyze
          showCompare={showCompare}
        />
        <ComparePage />
      </>
    );
  }
  // ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar
        dark={dark}
        onToggleDark={() => setDark(d => !d)}
        onLoginClick={() => setShowLogin(true)}
        onProfileClick={() => setShowProfile(true)}
        onCompareClick={() => setShowCompare(true)}   // ← NEW
        showCompare={showCompare}
      />

      {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}

      <div className="pt-20 pb-6 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Welcome back, <span style={{ color: 'var(--brand)' }}>{user.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Paste your code and click Visualize to get started
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-3">

          <div className="flex flex-col gap-3">
            <div className="card p-1">
              <div className="flex flex-wrap gap-1">
                {SNIPPET_KEYS.map(key => (
                  <button key={key} onClick={() => handleSnippet(key)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-all font-mono"
                    style={{
                      background: activeSnippet === key && SNIPPETS[key].code === code ? 'var(--text)' : 'transparent',
                      color: activeSnippet === key && SNIPPETS[key].code === code ? 'var(--bg)' : 'var(--text-muted)',
                    }}
                    onMouseEnter={e => { if (!(activeSnippet === key && SNIPPETS[key].code === code)) e.currentTarget.style.background = 'var(--bg-muted)'; }}
                    onMouseLeave={e => { if (!(activeSnippet === key && SNIPPETS[key].code === code)) e.currentTarget.style.background = 'transparent'; }}>
                    {SNIPPETS[key].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="card overflow-hidden flex flex-col" style={{ minHeight: 340 }}>
              <div className="flex items-center justify-between px-4 py-2.5 border-b"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Code Input</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md capitalize"
                  style={{ background: 'var(--bg-muted)', color: 'var(--brand)', border: '1px solid var(--border)' }}>
                  {currentLang}
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <CodeEditor value={code} onChange={setCode} language={currentLang} dark={dark} />
              </div>
            </div>

            <div className="card p-2 flex gap-2 items-center">
              <div className="relative flex-1">
                <select value={vizMode} onChange={e => setVizMode(e.target.value)}
                  className="w-full appearance-none text-sm px-3 py-2 pr-8 rounded-lg font-medium cursor-pointer outline-none"
                  style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {VIZ_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }} />
              </div>
              <button onClick={handleVisualize} disabled={loading || !code.trim()} className="btn-primary px-5 py-2">
                <Play size={13} /> {loading ? 'Analyzing...' : 'Visualize'}
              </button>
            </div>
          </div>

          <div className="card flex flex-col overflow-hidden" style={{ minHeight: 500 }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Concept Map</span>
              <ExportShare result={result} code={code} />
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
              {!loading && !result && !error && <EmptyState />}
              {loading && <LoadingState message={loadingMsg} />}
              {!loading && error && <ErrorState message={error} />}
              {!loading && result && (
                <ResultPanel result={result} dark={dark} vizMode={vizMode} code={code} language={currentLang} />
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex items-center justify-between flex-wrap gap-4"
          style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>© 2025 Code2Concept. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[{ label: 'Terms & Conditions', href: '#' }, { label: 'Privacy Policy', href: '#' }, { label: 'GitHub', href: 'https://github.com', external: true }].map(l => (
              <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined}
                className="text-xs transition-colors" style={{ color: 'var(--text-subtle)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
