import React from 'react';
import { useParams } from 'react-router-dom';

const PortfolioPage = () => {
  const { username } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{username}'s Portfolio</h1>
      {/* Fetch and display portfolio data */}
    </div>
  );
};

export default PortfolioPage;