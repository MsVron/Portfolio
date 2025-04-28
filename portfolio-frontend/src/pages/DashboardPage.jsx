import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProfileEditor from '../components/dashboard/ProfileEditor';
import PortfolioPreview from '../components/dashboard/PortfolioPreview';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="container mx-auto p-4">Please log in.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <ProfileEditor />
      <PortfolioPreview />
    </div>
  );
};

export default DashboardPage;