import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        navigate('/login');
        return;
      }

      if (session) {
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

        // Update auth store
        await login(session.user.email!, session.user.user_metadata.password);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, login]);

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