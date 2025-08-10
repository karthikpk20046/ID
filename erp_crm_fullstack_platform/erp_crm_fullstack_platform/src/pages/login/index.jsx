import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBackground from './components/LoginBackground';
import CompanyLogo from './components/CompanyLogo';
import LoginForm from './components/LoginForm';
import SecurityBadge from './components/SecurityBadge';

const LoginPage = () => {
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userSession = localStorage.getItem('userSession');
    
    if (authToken && userSession) {
      try {
        const session = JSON.parse(userSession);
        // Check if session is still valid (not expired)
        const loginTime = new Date(session.loginTime);
        const currentTime = new Date();
        const timeDifference = currentTime - loginTime;
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        
        // If remember me was checked or session is less than 24 hours old
        if (session?.rememberMe || hoursDifference < 24) {
          navigate('/dashboard', { replace: true });
        } else {
          // Clear expired session
          localStorage.removeItem('authToken');
          localStorage.removeItem('userSession');
        }
      } catch (error) {
        console.error('Error parsing user session:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userSession');
      }
    }
  }, [navigate]);

  return (
    <LoginBackground>
      <div className="space-y-6">
        <CompanyLogo />
        <LoginForm />
        <SecurityBadge />
      </div>
    </LoginBackground>
  );
};

export default LoginPage;