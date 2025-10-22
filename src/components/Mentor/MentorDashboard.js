import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';

const MentorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('maverick_user'));
    
    const fetchDashboardData = async () => {
      try {
        const data = await apiService.getMentorDashboard(user.mentorId);
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">EA Vault Portal</h1>
        <p className="text-green-600">
          All systems are running smoothly! You have {dashboardData.totalLicences} active licences. 
          Your Mentor id is -&gt; {dashboardData.mentorId}
        </p>
        <p className="text-gray-600">Today ({dashboardData.date}) ✓</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Licences Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Licences</h3>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.totalLicences}</p>
          <p className="text-gray-500 text-sm mt-2">All time EA users.</p>
          <p className="text-gray-600 font-medium mt-2">Active Subscriptions</p>
          <p className="text-gray-500 text-sm">Current Active EA Users.</p>
        </div>

        {/* Total EAs Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total EAs</h3>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.totalEAs}</p>
          <p className="text-gray-500 text-sm mt-2">All EAs you are Licencing</p>
        </div>

        {/* Maximum Licences Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Maximum Licences</h3>
          <p className="text-3xl font-bold text-gray-900">{dashboardData.maxLicences}</p>
          <p className="text-gray-500 text-sm mt-2">Total licences You can generate</p>
        </div>
      </div>

      {/* Recent EAs */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Your Expert Advisors</h2>
          <Link 
            to="/mentor/eas"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Manage EAs
          </Link>
        </div>
        
        {dashboardData.eas && dashboardData.eas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EA Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.eas.map((ea) => (
                  <tr key={ea.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ea.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {ea.totalUsers}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ea.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No EAs created yet.</p>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
