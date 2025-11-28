'use client';
import { useState } from 'react';

export default function FeaturePage() {
  const [feature, setFeature] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRunAI = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch(`/api/ai/${encodeURIComponent(feature)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature })
      });

      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Feature</h1>
      <textarea
        value={feature}
        onChange={(e) => setFeature(e.target.value)}
        placeholder="Enter feature prompt..."
        style={{ width: '100%', height: 100 }}
      />
      <button onClick={handleRunAI} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? 'Running...' : 'Run AI'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h2>Result:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
