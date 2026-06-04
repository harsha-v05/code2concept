import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('c2c_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle Google OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlName = params.get('name');
    if (urlToken) {
      localStorage.setItem('c2c_token', urlToken);
      setToken(urlToken);
      window.history.replaceState({}, '', '/');
      fetchProfile(urlToken);
    } else if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchProfile(t) {
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/me', {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) setUser(await res.json());
      else logout();
    } catch { logout(); }
    finally { setLoading(false); }
  }

  function login(userData, userToken) {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('c2c_token', userToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('c2c_token');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
