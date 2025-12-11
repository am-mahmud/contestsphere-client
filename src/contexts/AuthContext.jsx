import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { authAPI } from '../api/auth';
import api from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [authReady, setAuthReady] = useState(false);

  // Fetch current user from backend
  const {
    data: user = null,
    isLoading: userLoading,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthReady(true);
        return null;
      }

      try {
        const { data } = await api.get('/api/users/me');
        setAuthReady(true);
        return data;
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        setAuthReady(true);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password, photo }) => {
      // Create Firebase user
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Register in backend
      const data = await authAPI.register({ name, email, password, photo });
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['currentUser'], data.user);
    },
    onError: (error) => {
      console.error('Registration error:', error);
      throw error;
    }
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      // Login to Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // Login to backend
      const data = await authAPI.login({ email, password });
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['currentUser'], data.user);
    },
    onError: (error) => {
      console.error('Login error:', error);
      throw error;
    }
  });

  // Google Sign In mutation
  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
    
      return result;
    },
    onError: (error) => {
      console.error('Google sign-in error:', error);
      throw error;
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem('token');
      await signOut(auth);
    },
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      throw error;
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        
        const token = localStorage.getItem('token');
        if (token) {
          refetchUser();
        }
      } else {
        
        if (!userLoading) {
          queryClient.setQueryData(['currentUser'], null);
          setAuthReady(true);
        }
      }
    });

    return () => unsubscribe();
  }, [refetchUser, queryClient, userLoading]);

  const register = async (name, email, password, photo) => {
    return registerMutation.mutateAsync({ name, email, password, photo });
  };

  const login = async (email, password) => {
    return loginMutation.mutateAsync({ email, password });
  };

  const googleSignIn = async () => {
    return googleSignInMutation.mutateAsync();
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  const setUser = (userData) => {
    queryClient.setQueryData(['currentUser'], userData);
  };

  const value = {
    user,
    loading: userLoading || 
             registerMutation.isPending || 
             loginMutation.isPending || 
             logoutMutation.isPending,
    register,
    login,
    googleSignIn,
    logout,
    setUser,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    registerError: registerMutation.error,
    loginError: loginMutation.error,
  };

  if (!authReady && userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-[#20beff]"></span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};