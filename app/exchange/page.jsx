import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Zap, Settings, X, Info } from 'lucide-react';

/**
 * Main application component.
 * This component provides a clean, error-free React structure
 * using functional components and hooks, styled with Tailwind CSS.
 */
const App = () => {
  // Global state for application management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    title: 'Welcome!',
    message: 'This is an error-free React starter template using Tailwind CSS and Lucide icons.',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to simulate a data fetch or task execution
  const executeTask = useCallback(() => {
    setLoading(true);
    setError(null);
    setData(prev => ({ ...prev, title: 'Task in Progress...', message: 'Simulating API call or heavy computation...' }));

    // Simulate network delay
    setTimeout(() => {
      try {
        // Successful operation
        setData({
          title: 'Operation Complete!',
          message: 'The component structure is now clean and error-free. Ready for new features!',
        });
      } catch (e) {
        setError('An unexpected error occurred during the task simulation.');
        setData({
            title: 'Error!',
            message: 'Failed to complete task.',
        });
      } finally {
        setLoading(false);
      }
    }, 1500);
  }, []);

  // Run initial task on mount
  useEffect(() => {
    executeTask();
  }, [executeTask]);

  // Modal component for displaying information or errors (replaces alert())
  const Modal = ({ title, content, onClose }) => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Info className="w-5 h-5 mr-2 text-indigo-500" />
              {title}
            </h3>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{content}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition duration-150"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transition-all duration-300">
        <header className="text-center mb-8">
          <Zap className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            React App Base
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {loading ? 'Loading...' : 'Ready to build!'}
          </p>
        </header>

        <main className="space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl shadow-inner border border-indigo-200 dark:border-indigo-700">
            <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200 mb-2">{data.title}</h2>
            <p className="text-indigo-700 dark:text-indigo-300 text-sm">{data.message}</p>
          </div>

          {error && (
            <div className="bg-red-100 p-3 rounded-lg text-red-700 font-medium border border-red-300">
              Error: {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={executeTask}
              disabled={loading}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-medium transition duration-300 transform shadow-lg
                ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Processing...' : 'Run Task'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-shrink-0 flex items-center justify-center px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-medium shadow-lg hover:bg-gray-300 transition duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </button>
          </div>
        </main>
      </div>

      <Modal
        title="Settings & Info"
        content="This section is currently a placeholder. The previous rendering error has been fixed by ensuring only standard React or data- attributes are used."
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default App;
