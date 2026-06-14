import { useState, useCallback } from 'react';
import { compareCode } from '../utils/api';

export function useCompare() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState('');

  const LOADING_MSGS = [
    'Reading both snippets...',
    'Measuring complexity...',
    'Spotting differences...',
    'Weighing trade-offs...',
    'Reaching a verdict...',
  ];

  const compare = useCallback(async (code1, lang1, code2, lang2) => {
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
      const data = await compareCode(code1, lang1, code2, lang2);
      setResult(data.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Something went wrong';
      setError(msg);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
    setLoadingMsg('');
  }, []);

  return { result, loading, error, loadingMsg, compare, reset };
}
