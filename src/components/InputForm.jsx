import { useState } from 'react';

function InputForm({ url, setUrl, setSummary }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');
    try {
      // Use the Vercel API endpoint
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url }),
      });
      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        setError(data.error || 'Failed to get summary');
      }
    } catch (err) {
      setError('Server error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-8 md:p-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url-input" className="block text-lg font-medium text-gray-700 mb-3">
            Substack URL
          </label>
          <input
            id="url-input"
            type="url"
            placeholder="Paste Substack URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all duration-200 ease-in-out"
            style={{ fontSize: '18px' }}
          />
        </div>
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-12 text-xl rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-lg"
            style={{ backgroundColor: '#ff6719', fontSize: '20px' }}
            disabled={loading}
          >
            {loading ? 'Summarizing...' : 'Summarize'}
          </button>
        </div>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </form>
    </div>
  );
}

export default InputForm;
