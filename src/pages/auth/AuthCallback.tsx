import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          navigate('/login');
          return;
        }

        if (!session) {
          console.error('No session found');
          navigate('/login');
          return;
        }

        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select()
          .eq('id', session.user.id)
          .maybeSingle();

        if (userError) {
          console.error('Error getting user data:', userError);
          navigate('/login');
          return;
        }

        if (!userData) {
          console.error('User profile not found');
          navigate('/login');
          return;
        }

        // Set the user in the auth store
        useAuthStore.setState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Navigate to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-dark-100">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 