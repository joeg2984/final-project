// frontend/src/components/FinancialProjection.js
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const FinancialProjection = ({ financialProjection }) => {
  if (!financialProjection) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Financial Projections</h3>
        <p>No financial projections available.</p>
      </div>
    );
  }

  const data = [
    { name: 'Revenue', value: financialProjection.revenue },
    { name: 'COGS', value: financialProjection.cost_of_goods_sold },
    { name: 'Gross Profit', value: financialProjection.gross_profit },
    { name: 'Op. Expenses', value: financialProjection.operational_expenses },
    { name: 'Net Profit', value: financialProjection.net_profit },
  ];

// In FinancialProjection.js and RiskAssessment.js

  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-2">Financial Projections</h3>
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        className="mx-auto"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default FinancialProjection;
