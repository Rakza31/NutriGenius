import React, { useState, useEffect } from 'react';
import { getHealthHistory } from '../utils/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHealthHistory();
        setHistory(data);
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Your Health History
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Track your progress over time
          </p>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assessments yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Complete your first health assessment to see your history here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((assessment, index) => (
              <div key={index} className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Assessment #{index + 1}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(assessment.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Calories</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {assessment.calories || 'N/A'} kcal
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Weight</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {assessment.weight || 'N/A'} kg
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Goal</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {assessment.goal || 'N/A'}
                      </dd>
                    </div>
                  </div>
                  {assessment.notes && (
                    <div className="mt-4">
                      <dt className="text-sm font-medium text-gray-500">Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900">{assessment.notes}</dd>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
