import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Braces, Eye, EyeOff, Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react';

function Input({ icon: Icon, type, placeholder, value, onChange, show, onToggle }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-dark2/40 dark:text-surface-2/40" />
      <input
        type={show !== undefined ? (show ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-surface-3 dark:border-surface-dark3 bg-surface-0 dark:bg-surface-dark1 text-surface-dark0 dark:text-surface-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
      />
      {onToggle && (
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-dark2/40 dark:text-surface-2/40">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
  );
}

export default function AuthPage({ onClose }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        await signup(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-surface-0 dark:bg-surface-dark1 rounded-2xl border border-surface-3 dark:border-surface-dark3 shadow-2xl overflow-hidden animate-slide-up">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center border-b border-surface-3 dark:border-surface-dark3">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-surface-dark2 rounded-lg flex items-center justify-center">
              <Braces size={16} className="text-brand-200" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-surface-dark0 dark:text-surface-1">
              Code<span className="text-brand-500">2</span>Concept
            </span>
          </div>
          <h2 className="text-base font-bold text-surface-dark0 dark:text-surface-1">
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="text-xs text-surface-dark2/60 dark:text-surface-2/50 mt-1">
            {mode === 'login' ? 'Login to save your visualizations' : 'Join to save and revisit your diagrams'}
          </p>
        </div>

        <div className="px-6 py-5">
          {/* Google button */}
          <button
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-surface-3 dark:border-surface-dark3 bg-surface-1 dark:bg-surface-dark2 text-sm font-semibold text-surface-dark0 dark:text-surface-1 hover:bg-surface-2 dark:hover:bg-surface-dark3 transition-all mb-4"
            onClick={() => setError('Google login: Add your Google Client ID in AuthContext.jsx')}
          >
            <Chrome size={16} className="text-blue-500" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-surface-3 dark:bg-surface-dark3" />
            <span className="text-xs text-surface-dark2/40 dark:text-surface-2/30 font-medium">or</span>
            <div className="flex-1 h-px bg-surface-3 dark:bg-surface-dark3" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'signup' && (
              <Input icon={User} type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
            )}
            <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} show={showPass} onToggle={() => setShowPass(s => !s)} />

            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-dark2 dark:bg-surface-dark3 text-surface-1 text-sm font-semibold hover:bg-surface-dark0 dark:hover:bg-surface-dark2 transition-all disabled:opacity-50 mt-1"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-xs text-surface-dark2/60 dark:text-surface-2/50 mt-4">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-brand-500 font-semibold hover:underline">
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>

          {/* Close */}
          <button onClick={onClose} className="w-full text-center text-xs text-surface-dark2/40 dark:text-surface-2/30 mt-3 hover:opacity-70">
            Continue without account
          </button>
        </div>
      </div>
    </div>
  );
}
