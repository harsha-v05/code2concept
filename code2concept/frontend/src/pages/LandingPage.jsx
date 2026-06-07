import React, { useState } from 'react';
import { ArrowRight, Code2, GitBranch, Terminal, Zap, Shield, Users, Play, Lock } from 'lucide-react';
import { analyzeCode } from '../utils/api';

const FEATURES = [
  { icon: GitBranch, title: 'Smart Diagrams', desc: 'Auto-generates flowcharts, sequence diagrams, state machines and class diagrams from your code.' },
  { icon: Terminal, title: 'Live Execution', desc: 'Run code in 15+ languages instantly. See real output right next to your diagram.' },
  { icon: Zap, title: 'AI Explanations', desc: 'Get friendly step-by-step breakdowns that mix plain English with technical details.' },
  { icon: Shield, title: 'Save History', desc: 'All your visualizations are saved to your account. Access them anytime.' },
  { icon: Code2, title: '15+ Languages', desc: 'Python, JavaScript, Java, C++, Go, Rust, TypeScript and many more.' },
  { icon: Users, title: 'Export & Share', desc: 'Export as PDF or JSON. Share your concept maps with teammates.' },
];

const DEMO_CODE = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`;

export default function LandingPage({ onLogin, onSignup }) {
  const [code, setCode] = useState(DEMO_CODE);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [used, setUsed] = useState(false);

  async function handleTry() {
    if (!code.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeCode(code, 'flowchart');
      setResult(data.data);
      setUsed(true);
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Navbar */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--brand)' }}>C2</div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Code2Concept</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onLogin} className="btn-ghost text-sm px-3 py-1.5">Sign in</button>
            <button onClick={onSignup} className="btn-primary text-sm px-3 py-1.5">Get started free</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-6 badge badge-brand">
          <Zap size={11} /> Free · No credit card required
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-5 leading-tight" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Understand any code<br />
          <span style={{ color: 'var(--brand)' }}>visually</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
          Paste any algorithm or data structure — Code2Concept generates interactive diagrams, runs your code, and explains every step in plain English.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button onClick={onSignup} className="btn-primary px-6 py-3 text-sm font-semibold flex items-center gap-2">
            Start visualizing free <ArrowRight size={15} />
          </button>
          <button onClick={onLogin} className="btn-secondary px-6 py-3 text-sm font-semibold">
            Sign in to your account
          </button>
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--text-subtle)' }}>
          Join thousands of students and developers
        </p>
      </section>

      {/* ── FREE TRIAL SECTION ── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Try it right now — no signup needed
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            1 free visualization. Paste your code below and click Visualize.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {/* Editor header */}
          <div className="px-4 py-2.5 flex items-center justify-between"
            style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-mono ml-1" style={{ color: 'var(--text-muted)' }}>try_it.py</span>
            </div>
            {!used ? (
              <button onClick={handleTry} disabled={loading || !code.trim()}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                style={{ background: loading ? '#6b7280' : 'var(--brand)' }}>
                {loading ? 'Analyzing...' : <><Play size={11} /> Visualize free</>}
              </button>
            ) : (
              <button onClick={onSignup}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: 'var(--brand)' }}>
                <Lock size={11} /> Sign up for unlimited
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2" style={{ minHeight: 280 }}>
            {/* Code input */}
            <div style={{ borderRight: '1px solid var(--border)' }}>
              <textarea
                value={code}
                onChange={e => !used && setCode(e.target.value)}
                disabled={used}
                className="w-full h-full p-4 text-xs font-mono resize-none outline-none"
                style={{
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  minHeight: 280,
                  opacity: used ? 0.6 : 1,
                }}
                placeholder="Paste your code here..."
              />
            </div>

            {/* Result side */}
            <div className="p-4" style={{ background: 'var(--bg)' }}>
              {!result && !loading && !error && (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--bg-muted)' }}>
                    <GitBranch size={18} style={{ color: 'var(--text-subtle)' }} />
                  </div>
                  <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                    Your diagram will appear here
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                  <div className="spinner w-8 h-8" />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Analyzing your code...</p>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl text-xs" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}>
                  {error}
                </div>
              )}

              {result && (
                <div className="flex flex-col gap-3">
                  {/* Name + description */}
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{result.name}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{result.description}</p>
                  </div>

                  {/* Complexity */}
                  <div className="flex gap-2">
                    {result.time_complexity && (
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md" style={{ background: '#fef3c7', color: '#92400e' }}>
                        Time: {result.time_complexity}
                      </span>
                    )}
                    {result.space_complexity && (
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md" style={{ background: '#eff6ff', color: '#1e40af' }}>
                        Space: {result.space_complexity}
                      </span>
                    )}
                  </div>

                  {/* Steps preview */}
                  {result.steps?.slice(0, 3).map((step, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs"
                      style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-[10px]"
                        style={{ background: 'var(--brand)' }}>{i + 1}</span>
                      {step.title}
                    </div>
                  ))}

                  {/* Signup CTA */}
                  <div className="p-4 rounded-xl text-center mt-2"
                    style={{ background: 'var(--brand-light)', border: '1px solid var(--brand)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--brand-dark)' }}>
                      🎉 Want full diagrams, history & more?
                    </p>
                    <button onClick={onSignup}
                      className="btn-primary px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 mx-auto">
                      Create free account <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold tracking-tight mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Everything you need to understand code
          </h2>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>Built for students, developers, and educators</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 rounded-xl transition-all"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: 'var(--brand-light)' }}>
                <Icon size={16} style={{ color: 'var(--brand)' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Language pills */}
      <section className="max-w-6xl mx-auto px-4 pb-16 text-center">
        <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Supports all major languages</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust', 'TypeScript', 'C#', 'Ruby', 'Swift', 'Kotlin', 'PHP', 'R', 'Lua'].map(l => (
            <span key={l} className="badge badge-muted text-xs px-3 py-1">{l}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--brand-light)', border: '1px solid var(--brand)' }}>
          <h2 className="text-3xl font-semibold tracking-tight mb-3" style={{ color: 'var(--brand-dark)', letterSpacing: '-0.02em' }}>
            Ready to visualize your code?
          </h2>
          <p className="mb-6" style={{ color: 'var(--brand)' }}>Free forever. No credit card required.</p>
          <button onClick={onSignup} className="btn-primary px-8 py-3 text-sm font-semibold flex items-center gap-2 mx-auto">
            Create free account <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>© 2025 Code2Concept. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[{ label: 'Terms & Conditions', href: '#' }, { label: 'Privacy Policy', href: '#' }, { label: 'GitHub', href: 'https://github.com' }].map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined}
                className="text-xs transition-colors" style={{ color: 'var(--text-subtle)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}>{l.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}