import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://code2concept-backend.onrender.com',
  timeout: 60000,
});

export async function analyzeCode(code, vizMode) {
  const { data } = await api.post('/analyze', { code, viz_mode: vizMode });
  return data;
}

// ─── NEW ──────────────────────────────────────────────────────────
export async function compareCode(code1, lang1, code2, lang2) {
  const { data } = await api.post('/compare', { code1, lang1, code2, lang2 });
  return data;
}
// ─────────────────────────────────────────────────────────────────

export async function checkHealth() {
  const { data } = await api.get('/health');
  return data;
}

export default api;
