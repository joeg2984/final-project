// frontend/src/components/Evaluation.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from './Autocomplete'; // Ensure this is updated
import FinancialProjection from './FinancialProjection';
import RiskAssessment from './RiskAssessment';
import CompetitorList from './CompetitorList';
import MitigationStrategies from './MitigationStrategies';

const Evaluation = () => {
  const [businessIdea, setBusinessIdea] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [knownLocations, setKnownLocations] = useState([]);
  const [knownBusinessIdeas, setKnownBusinessIdeas] = useState([]);

  useEffect(() => {
    console.log('API URL:', process.env.REACT_APP_API_URL); // Debugging

    // Fetch known locations
    axios.get(`${process.env.REACT_APP_API_URL}/locations`)
      .then((response) => {
        console.log('Fetched Locations:', response.data); // Debugging
        setKnownLocations(response.data);
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
        setError('Failed to fetch locations.');
      });

    // Fetch known business ideas
    axios.get(`${process.env.REACT_APP_API_URL}/business-ideas`)
      .then((response) => {
        console.log('Fetched Business Ideas:', response.data); // Debugging
        setKnownBusinessIdeas(response.data);
      })
      .catch((error) => {
        console.error('Error fetching business ideas:', error);
        setError('Failed to fetch business ideas.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    console.log('Sending data:', {
      business_idea: businessIdea,
      location: location,
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/evaluate`, {
        business_idea: businessIdea,
        location: location,
      });

      console.log('Received Evaluation:', response.data); // Debugging
      setResult(response.data);
    } catch (err) {
      console.error('Error during evaluation:', err);
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      console.log('Evaluation request completed'); // Debugging
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Business Idea Evaluator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessIdea" className="block text-sm font-medium text-gray-700">
            Business Idea:
          </label>
          <Autocomplete
            inputProps={{
              id: "businessIdea",               // Added id
              name: "businessIdea",             // Added name
              required: true,
              className:
                'mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
              placeholder: "Enter your business idea", // Optional placeholder
            }}
            items={Array.isArray(knownBusinessIdeas) ? knownBusinessIdeas : []}
            value={businessIdea}
            onChange={(e) => setBusinessIdea(e.target.value)}
            onSelect={(val) => setBusinessIdea(val)}
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location:
          </label>
          <Autocomplete
            inputProps={{
              id: "location",                 // Added id
              name: "location",               // Added name
              required: true,
              className:
                'mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
              placeholder: "Enter a location", // Optional placeholder
            }}
            getItemValue={(item) => item}      // Remove these props
            renderItem={(item, isHighlighted) => ( // Remove these props
              <div
                style={{ background: isHighlighted ? '#eee' : 'transparent' }}
                key={item}
              >
                {item}
              </div>
            )}
            items={Array.isArray(knownLocations) ? knownLocations : []}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onSelect={(val) => setLocation(val)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Evaluate
        </button>
      </form>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
          <button
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Evaluation Results */}
      {result && (
        <div className="mt-6 p-4 border border-gray-200 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold">Assessment: {result.rating}</h2>
          <p className="mt-2 whitespace-pre-wrap">{result.explanation}</p>

          {/* Display Corrections if any */}
          {result.new_location_added && (
            <p className="mt-2 text-green-600">
              New location added: <strong>{result.corrected_location}</strong>
            </p>
          )}
          {result.new_business_idea_added && (
            <p className="mt-2 text-green-600">
              New business idea added: <strong>{result.corrected_business_idea}</strong>
            </p>
          )}

          {/* Competitors */}
          <CompetitorList competitors={result.competitors} />

          {/* Financial Projections */}
          <FinancialProjection financialProjection={result.financial_projection} />

          {/* Risk Assessment */}
          <RiskAssessment risks={result.risks} />

          {/* Mitigation Strategies */}
          <MitigationStrategies strategies={result.mitigation_strategies} />

          {/* Market Metrics */}
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">Market Metrics</h3>
            <div className="mb-2">
              <p><strong>Trend Score:</strong> {result.trend_score}</p>
              <progress className="w-full h-2 bg-gray-200 rounded" value={result.trend_score} max="100"></progress>
            </div>
            <div>
              <p><strong>Economic Indicator:</strong> {result.economic_indicator}</p>
              <progress className="w-full h-2 bg-gray-200 rounded" value={result.economic_indicator} max="100"></progress>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default Evaluation;
