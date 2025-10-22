import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const ClientDashboard = () => {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('maverick_user'));
    
    const fetchClientData = async () => {
      try {
        const data = await apiService.getClientDashboard(user.id);
        setClientData(data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClientData();
  }, []);

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {clientData.client.name}!
          </h1>
          <p className="text-green-600 mb-4">✅ Your EA is active and running smoothly</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Details</h3>
              <div className="space-y-2">
                <p><strong>Email:</strong> {clientData.client.email}</p>
                <p><strong>Mentor ID:</strong> {clientData.client.mentorId}</p>
                <p><strong>Licence Key:</strong> {clientData.client.licenceKey}</p>
                <p><strong>Activated:</strong> {new Date(clientData.client.activatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {clientData.ea && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Your EA</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {clientData.ea.name}</p>
                  <p><strong>Version:</strong> {clientData.ea.version}</p>
                  <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">EA Status</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">All Systems Operational</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your Expert Advisor is running properly. No issues detected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
