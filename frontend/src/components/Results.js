import React, { useState, useEffect } from 'react';
import { getNutritionResults } from '../utils/api';

const Results = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getNutritionResults();
        setResults(data);
      } catch (err) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your health data...</p>
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
            Your Nutrition Analysis
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Personalized recommendations based on your health assessment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Calorie Needs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Daily Calorie Needs
            </h2>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {results?.calories || '2,000'} kcal
            </div>
            <p className="text-gray-600">
              Based on your activity level and health goals
            </p>
          </div>

          {/* Macronutrient Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Macronutrient Breakdown
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Protein</span>
                <span className="font-semibold">{results?.protein || '150g'}</span>
              </div>
              <div className="flex justify-between">
                <span>Carbohydrates</span>
                <span className="font-semibold">{results?.carbs || '250g'}</span>
              </div>
              <div className="flex justify-between">
                <span>Fats</span>
                <span className="font-semibold">{results?.fats || '65g'}</span>
              </div>
            </div>
          </div>

          {/* Meal Recommendations */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recommended Meals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Breakfast</h3>
                <p className="text-sm text-gray-600">
                  {results?.meals?.breakfast || 'Oatmeal with berries and nuts'}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Lunch</h3>
                <p className="text-sm text-gray-600">
                  {results?.meals?.lunch || 'Grilled chicken salad with quinoa'}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Dinner</h3>
                <p className="text-sm text-gray-600">
                  {results?.meals?.dinner || 'Salmon with roasted vegetables'}
                </p>
              </div>
            </div>
          </div>

          {/* Health Insights */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Health Insights
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                {results?.insights || 'Based on your health assessment, we recommend focusing on a balanced diet with adequate protein intake to support your goals. Consider incorporating more whole foods and reducing processed foods.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
