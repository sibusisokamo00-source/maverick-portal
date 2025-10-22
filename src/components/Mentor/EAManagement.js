import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';

const EAManagement = () => {
  const [eas, setEas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEA, setNewEA] = useState({ name: '', version: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEAs();
  }, []);

  const fetchEAs = async () => {
    const user = JSON.parse(localStorage.getItem('maverick_user'));
    
    try {
      const data = await apiService.getEAs(user.mentorId);
      setEas(data.eas || []);
    } catch (error) {
      console.error('Error fetching EAs:', error);
    }
  };

  const handleCreateEA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const user = JSON.parse(localStorage.getItem('maverick_user'));

    try {
      const data = await apiService.createEA(user.mentorId, newEA.name, newEA.version);

      if (data.id) {
        setMessage('✅ EA created successfully!');
        setShowModal(false);
        setNewEA({ name: '', version: '' });
        fetchEAs(); // Refresh list
      } else {
        setMessage('❌ Failed to create EA');
      }
    } catch (error) {
      setMessage('❌ Error creating EA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Expert Advisors</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New EA
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-md mb-6 ${
          message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">TOTAL EAs</h2>
          <p className="text-gray-600 text-sm">All EAs you have</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {eas.map((ea) => (
                <tr key={ea.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ea.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ea.totalUsers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ea.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      to={`/mentor/eas/${ea.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {eas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No EAs created yet.</p>
          </div>
        )}
      </div>

      {/* Add EA Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add New EA</h2>
            </div>

            <form onSubmit={handleCreateEA} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EA Name
                </label>
                <input
                  type="text"
                  required
                  value={newEA.name}
                  onChange={(e) => setNewEA({...newEA, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., MAVERICK SCALPER EA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  required
                  value={newEA.version}
                  onChange={(e) => setNewEA({...newEA, version: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1.0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirmAdmin"
                  required
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="confirmAdmin" className="text-sm text-gray-700">
                  I confirm that I am an admin
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Add EA'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EAManagement;