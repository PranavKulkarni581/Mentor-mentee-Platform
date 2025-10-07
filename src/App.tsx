import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { MenteeDashboard } from './components/MenteeDashboard';
import { MentorDashboard } from './components/MentorDashboard';
import { Toaster } from './components/ui/sonner';

type AppState = 'landing' | 'mentee' | 'mentor-auth' | 'mentor-dashboard';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    department?: string;
    role?: string;
  };
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('mentor-user');
    const savedToken = localStorage.getItem('mentor-token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedToken);
        setCurrentState('mentor-dashboard');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('mentor-user');
        localStorage.removeItem('mentor-token');
      }
    }
  }, []);

  const handleMenteeSelect = () => {
    setCurrentState('mentee');
  };

  const handleMentorSelect = () => {
    setCurrentState('mentor-auth');
  };

  const handleMentorLogin = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    setCurrentState('mentor-dashboard');
    
    // Save to localStorage for persistence
    localStorage.setItem('mentor-user', JSON.stringify(userData));
    localStorage.setItem('mentor-token', token);
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken('');
    setCurrentState('landing');
    
    // Clear localStorage
    localStorage.removeItem('mentor-user');
    localStorage.removeItem('mentor-token');
  };

  const handleBackToHome = () => {
    setCurrentState('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* App Content */}
      {currentState === 'landing' && (
        <LandingPage 
          onMenteeSelect={handleMenteeSelect}
          onMentorSelect={handleMentorSelect}
        />
      )}

      {currentState === 'mentee' && (
        <MenteeDashboard onBack={handleBackToHome} />
      )}

      {currentState === 'mentor-auth' && (
        <AuthPage 
          onLogin={handleMentorLogin}
          onBack={handleBackToHome}
        />
      )}

      {currentState === 'mentor-dashboard' && user && accessToken && (
        <MentorDashboard 
          onLogout={handleLogout}
          user={user}
          accessToken={accessToken}
        />
      )}

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1e3a8a',
            border: '1px solid #dbeafe',
          },
        }}
      />
    </div>
  );
}