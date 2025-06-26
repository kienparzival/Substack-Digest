function SummaryBox({ summary }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-8 md:p-12">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">AI Summary</h2>
      </div>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed text-lg md:text-xl" style={{ fontSize: '18px' }}>
          {summary}
        </p>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-base text-gray-500">
          <span>Generated with AI</span>
          <span className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span>Ready</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SummaryBox;
