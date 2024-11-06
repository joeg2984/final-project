// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Autocomplete from 'react-autocomplete';

function App() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [knownLocations, setKnownLocations] = useState([]);
  const [knownBusinessIdeas, setKnownBusinessIdeas] = useState([]);

  useEffect(() => {
    // Fetch known locations
    fetch('http://127.0.0.1:8000/locations')
      .then((response) => response.json())
      .then((data) => setKnownLocations(data))
      .catch((error) => console.error('Error fetching locations:', error));

    // Fetch known business ideas
    fetch('http://127.0.0.1:8000/business-ideas')
      .then((response) => response.json())
      .then((data) => setKnownBusinessIdeas(data))
      .catch((error) => console.error('Error fetching business ideas:', error));
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
      const response = await fetch('http://127.0.0.1:8000/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ business_idea: businessIdea, location: location }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Network response was not ok');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  return (
    <div className="App container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Business Idea Evaluator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Idea:
          </label>
          <Autocomplete
            getItemValue={(item) => item}
            items={Array.isArray(knownBusinessIdeas) ? knownBusinessIdeas : []}
            renderItem={(item, isHighlighted) => (
          <div
            style={{ background: isHighlighted ? '#eee' : 'transparent' }}
            key={item}
          >
                {item}
           </div>
  )}
  value={businessIdea}
  onChange={(e) => setBusinessIdea(e.target.value)}
  onSelect={(val) => setBusinessIdea(val)}
  inputProps={{
    required: true,
    className:
      'mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
  }}
/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location:
          </label>
          <Autocomplete
  getItemValue={(item) => item}
  items={Array.isArray(knownLocations) ? knownLocations : []}
  renderItem={(item, isHighlighted) => (
    <div
      style={{ background: isHighlighted ? '#eee' : 'transparent' }}
      key={item}
    >
      {item}
    </div>
  )}
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  onSelect={(val) => setLocation(val)}
  inputProps={{
    required: true,
    className:
      'mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
  }}
/>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Evaluate
        </button>
      </form>

      {loading && <p className="mt-4 text-blue-500">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && (
        <div className="mt-6 p-4 border border-gray-200 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold">Assessment: {result.rating}</h2>
          <p className="mt-2 whitespace-pre-wrap">{result.explanation}</p>

          {/* Display Corrections if any */}
          {(result.new_location_added) && (
            <p className="mt-2 text-green-600">
              New location added: <strong>{result.corrected_location}</strong>
            </p>
          )}
          {(result.new_business_idea_added) && (
            <p className="mt-2 text-green-600">
              New business idea added: <strong>{result.corrected_business_idea}</strong>
            </p>
          )}

          {result.competitors && result.competitors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium">Nearby Competitors:</h3>
              <ul className="list-disc list-inside">
                {result.competitors.map((comp, index) => (
                  <li key={index} className="mt-1">
                    <strong>{comp.name}</strong> - Rating: {comp.rating} (
                    {comp.user_ratings_total} reviews) - {comp.vicinity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
