import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Github, User, LogOut, History, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ dark, onToggleDark, onLoginClick, onProfileClick }) {
  const { user, logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 h-14 transition-all duration-200 ${scrolled ? 'border-b' : ''}`}
      style={{ background: scrolled ? 'color-mix(in srgb, var(--bg) 90%, transparent)' : 'transparent', borderColor: 'var(--border)', backdropFilter: scrolled ? 'blur(12px)' : 'none' }}>
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--brand)' }}>C2</div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text)' }}>
            Code2Concept
          </span>
        </a>

        {/* Center - empty */}
        <div />

        {/* Right */}
        <div className="flex items-center gap-1">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-ghost w-8 h-8 p-0">
            <Github size={15} />
          </a>
          <button onClick={onToggleDark} className="btn-ghost w-8 h-8 p-0">
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {user ? (
            <div className="relative ml-1" ref={dropRef}>
              <button onClick={() => setDropOpen(o => !o)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg text-sm font-medium transition-colors"
                style={{ background: dropOpen ? 'var(--bg-muted)' : 'transparent', border: '1px solid var(--border)' }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                  style={{ background: 'var(--brand)' }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="max-w-[80px] truncate" style={{ color: 'var(--text)' }}>{user.name?.split(' ')[0]}</span>
                <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl shadow-lg overflow-hidden animate-fade-in z-50"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div className="px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{user.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                  <div className="p-1">
                    <button onClick={() => { onProfileClick?.(); setDropOpen(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors hover:bg-[var(--bg-muted)]"
                      style={{ color: 'var(--text)' }}>
                      <User size={13} /> Profile
                    </button>
                    <button onClick={() => { onProfileClick?.(); setDropOpen(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors hover:bg-[var(--bg-muted)]"
                      style={{ color: 'var(--text)' }}>
                      <History size={13} /> History
                    </button>
                    <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />
                    <button onClick={() => { logout(); setDropOpen(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                      <LogOut size={13} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 ml-1">
              <button onClick={onLoginClick} className="btn-ghost text-sm px-3 py-1.5">Sign in</button>
              <button onClick={onLoginClick} className="btn-primary text-sm px-3 py-1.5">Sign up</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
