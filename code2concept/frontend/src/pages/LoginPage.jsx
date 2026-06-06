import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onClose, initialMode = 'login' }) {
  const { login } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const update = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : mode === 'forgot' ? '/auth/forgot-password' : '/auth/login';
      const body = mode === 'signup' ? { name: form.name, email: form.email, password: form.password }
        : mode === 'forgot' ? { email: form.email }
        : { email: form.email, password: form.password };
      const API_URL = "https://code2concept-backend.onrender.com";

const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Something went wrong');
      if (mode === 'forgot') { setSuccess('Check your email for a reset link.'); }
      else { login(data.user, data.token); onClose?.(); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="px-6 pt-6 pb-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--brand)' }}>C2</div>
                <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Code2Concept</span>
              </div>
              <h2 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create an account' : 'Reset password'}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {mode === 'login' ? 'Sign in to access your visualizations' : mode === 'signup' ? 'Start visualizing code for free' : "We'll send you a reset link"}
              </p>
            </div>
            <button onClick={onClose} className="btn-ghost w-8 h-8 p-0 rounded-lg flex-shrink-0 flex items-center justify-center">
              <X size={15} />
            </button>
          </div>

          {/* Google */}
          {mode !== 'forgot' && (
            <>
              <a href="https://code2concept-backend.onrender.com/auth/google/login"
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer mb-4"
                style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </a>
              <div className="divider mb-4 text-xs" style={{ color: 'var(--text-subtle)' }}>or continue with email</div>
            </>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'signup' && (
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-subtle)' }} />
                <input type="text" placeholder="Full name" value={form.name} onChange={e => update('name', e.target.value)} required className="input pl-9" />
              </div>
            )}
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-subtle)' }} />
              <input type="email" placeholder="Email address" value={form.email} onChange={e => update('email', e.target.value)} required className="input pl-9" />
            </div>
            {mode !== 'forgot' && (
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-subtle)' }} />
                <input type={show ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => update('password', e.target.value)} required className="input pl-9 pr-9" />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-subtle)' }}>
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            )}
            {mode === 'login' && (
              <div className="text-right">
                <button type="button" onClick={() => setMode('forgot')} className="text-xs font-medium" style={{ color: 'var(--brand)' }}>
                  Forgot password?
                </button>
              </div>
            )}
            {error && <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}>{error}</div>}
            {success && <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--brand-light)', color: 'var(--brand-dark)', border: '1px solid var(--brand)' }}>{success}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-1 py-2.5">
              {loading ? <div className="spinner w-4 h-4" /> : <>
                {mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
                <ArrowRight size={14} />
              </>}
            </button>
          </form>

          <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' ? <>No account?{' '}<button onClick={() => { setMode('signup'); setError(''); }} className="font-medium" style={{ color: 'var(--brand)' }}>Sign up free</button></>
            : mode === 'signup' ? <>Already have an account?{' '}<button onClick={() => { setMode('login'); setError(''); }} className="font-medium" style={{ color: 'var(--brand)' }}>Sign in</button></>
            : <button onClick={() => { setMode('login'); setError(''); }} className="font-medium" style={{ color: 'var(--brand)' }}>Back to sign in</button>}
          </p>
        </div>
      </div>
    </div>
  );
}
