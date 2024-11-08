// frontend/src/components/RiskAssessment.js
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts';

const RiskAssessment = ({ risks }) => {
  if (!risks || risks.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Risk Assessment</h3>
        <p>No risks identified.</p>
      </div>
    );
  }

  // Prepare data for RadarChart
  const data = risks.map(risk => ({
    risk: risk.risk,
    risk_score: risk.risk_score,
  }));

  const maxScore = Math.max(...risks.map(r => r.risk_score));

  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-2">Risk Assessment</h3>
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="risk" />
        <PolarRadiusAxis angle={30} domain={[0, maxScore]} />
        <Radar name="Risk Score" dataKey="risk_score" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Legend />
      </RadarChart>
    </div>
  );
};

export default RiskAssessment;
