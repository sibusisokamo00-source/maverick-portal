import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';

const MagicLinkHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying your magic link...');

  useEffect(() => {
    const token = searchParams.get('token');
    
    const verifyToken = async () => {
      if (!token) {
        setStatus('Invalid magic link');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        const data = await apiService.verifyMagicLink(token);

        if (data.user && data.sessionToken) {
          localStorage.setItem('maverick_user', JSON.stringify(data.user));
          localStorage.setItem('maverick_session', data.sessionToken);
          setStatus('✅ Authentication successful! Redirecting...');
          setTimeout(() => navigate(data.redirectTo), 1500);
        } else {
          setStatus('❌ Invalid or expired magic link');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        setStatus('❌ Verification failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
};

export default MagicLinkHandler;
