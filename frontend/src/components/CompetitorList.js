// frontend/src/components/CompetitorList.js
import React from 'react';

const CompetitorList = ({ competitors }) => {
  if (!competitors || competitors.length === 0) {
    return null; // No need to render if no competitors
  }

  return (
    <div className="mt-4 mb-6">
      <h3 className="text-lg font-medium">Nearby Competitors:</h3>
      <ul className="list-disc list-inside">
        {competitors.map((comp, index) => (
          <li key={index} className="mt-1">
            <strong>{comp.name}</strong> - Rating: {comp.rating} (
            {comp.user_ratings_total} reviews) - {comp.vicinity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompetitorList;
