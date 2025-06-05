import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Tables } from '../lib/supabase';

type User = Tables['users'];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (user: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) throw authError;

          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (userError) throw userError;

          set({ user: userData, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to login', 
            isLoading: false 
          });
        }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (authError) throw authError;
          if (!authData.user) throw new Error('Registration failed');

          const { error: userError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                email,
                name,
              },
            ]);

          if (userError) throw userError;

          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (fetchError) throw fetchError;

          set({ user: userData, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to register', 
            isLoading: false 
          });
        }
      },
      
      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to logout'
          });
        }
      },
      
      updateProfile: async (updates) => {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', updates.id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            user: userData,
            error: null,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile'
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);