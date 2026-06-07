// Judge0 CE via RapidAPI - Free tier available
// OR we run code via our own backend using Python subprocess

export async function runCode(code, language) {
  // Use our own backend to execute code safely
  try {
    const res = await fetch('https://code2concept-backend.onrender.com/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || 'Execution failed');
    }

    const data = await res.json();
    return {
      output: data.output || '',
      error: data.error || '',
      success: data.success,
    };
  } catch (e) {
    throw new Error(e.message || 'Could not connect to execution server');
  }
}
