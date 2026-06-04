import { useState, useCallback } from 'react';
import { analyzeCode } from '../utils/api';

export function useAnalyze() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState('');

  const LOADING_MSGS = [
    'Parsing your code...',
    'Identifying patterns...',
    'Mapping logic flow...',
    'Generating diagram...',
    'Building concept tree...',
  ];

  const analyze = useCallback(async (code, vizMode) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingMsg(LOADING_MSGS[0]);

    const interval = setInterval(() => {
      setLoadingMsg(prev => {
        const idx = LOADING_MSGS.indexOf(prev);
        return LOADING_MSGS[(idx + 1) % LOADING_MSGS.length];
      });
    }, 1500);

    try {
      const data = await analyzeCode(code, vizMode);
      setResult(data.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Something went wrong';
      setError(msg);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }, []);

  return { result, loading, error, loadingMsg, analyze };
}
