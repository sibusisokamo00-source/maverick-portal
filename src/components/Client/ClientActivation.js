import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const ClientActivation = () => {
  const [formData, setFormData] = useState({
    email: '',
    mentorId: '',
    licenceKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await apiService.clientActivate(
        formData.email,
        formData.mentorId,
        formData.licenceKey
      );

      if (data.success) {
        setMessage(`✅ Activation link sent to ${formData.email}! Check your email.`);
        
        // For demo - auto-redirect with magic token
        if (data.magicToken) {
          setTimeout(() => {
            window.location.href = `/auth?token=${data.magicToken}`;
          }, 2000);
        }
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Activation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Activate Your EA Licence
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your details to activate your Expert Advisor
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleActivate}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mentorId" className="block text-sm font-medium text-gray-700">
                Mentor ID
              </label>
              <div className="mt-1">
                <input
                  id="mentorId"
                  name="mentorId"
                  type="text"
                  required
                  value={formData.mentorId}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="15776"
                />
              </div>
            </div>

            <div>
              <label htmlFor="licenceKey" className="block text-sm font-medium text-gray-700">
                Licence Key
              </label>
              <div className="mt-1">
                <input
                  id="licenceKey"
                  name="licenceKey"
                  type="text"
                  required
                  value={formData.licenceKey}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your licence key"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Activating...' : 'Activate Licence'}
              </button>
            </div>

            {message && (
              <div className={`p-3 rounded-md ${
                message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </div>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Are you a Mentor?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/mentor/login')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Mentor Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientActivation;
