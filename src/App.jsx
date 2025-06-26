import { useState } from 'react';
import InputForm from './components/InputForm';
import SummaryBox from './components/SummaryBox';
import './index.css';

function App() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">
            Substack Digest
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Get AI-powered summaries of your favorite Substack newsletters
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-8">
          <InputForm url={url} setUrl={setUrl} setSummary={setSummary} />
          {summary && <SummaryBox summary={summary} />}
        </div>
      </div>
    </div>
  );
}

export default App;
