import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const EADetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ea, setEa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEADetails();
  }, [id]);

  const fetchEADetails = async () => {
    try {
      const data = await apiService.getEADetails(id);
      setEa(data);
    } catch (error) {
      console.error('Error fetching EA details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLicence = async () => {
    const user = JSON.parse(localStorage.getItem('maverick_user'));
    
    try {
      const data = await apiService.createLicence(user.mentorId, id);
      
      if (data.licenceKey) {
        alert(`New licence created: ${data.licenceKey}`);
        fetchEADetails(); // Refresh to update user count
      }
    } catch (error) {
      alert('Error creating licence');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">EA not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/mentor/eas')}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to EAs
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{ea.name}</h1>
          <p className="text-gray-600">Version {ea.version}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">EA Details</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="font-mono text-sm bg-black text-green-400 p-4 rounded">
              {ea.code}
            </div>
            <p className="text-gray-600 text-sm mt-2">
              This is a EA code of {ea.name}. Put this inside your EA. Please remember not to share this code with anyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Information</h3>
              <div className="space-y-2">
                <p><strong>Total Users:</strong> {ea.totalUsers}</p>
                <p><strong>Created:</strong> {new Date(ea.createdAt).toLocaleDateString()}</p>
                <p><strong>Mentor ID:</strong> {ea.mentorId}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleCreateLicence}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Generate New Licence
                </button>
                
                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                  Download Self Hosting MT4 & MT5 files
                </button>
                
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
                  Delete EA
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notes</h3>
          <ul className="text-yellow-700 list-disc list-inside space-y-1">
            <li>Keep your EA code secure and never share it publicly</li>
            <li>Each licence key can only be used by one client</li>
            <li>Monitor your total users to stay within your licence limit</li>
            <li>Contact support if you need to increase your maximum licences</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EADetails;