import { createContext, useContext, useEffect, useRef } from 'react';
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
  const unsubscribeRef = useRef(null);
  
  const {
    data: user = null,
    isLoading
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;

      try {
        const { data } = await api.get('/api/users/me');
        return data;
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        return null;
      }
    },
    enabled: false,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 
  });

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password, photo }) => {
      await createUserWithEmailAndPassword(auth, email, password);
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

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      await signInWithEmailAndPassword(auth, email, password);
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
    unsubscribeRef.current = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
     
        queryClient.refetchQueries({ queryKey: ['currentUser'] });
      } else {
    
        queryClient.setQueryData(['currentUser'], null);
      }
    });

    queryClient.refetchQueries({ queryKey: ['currentUser'] });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [queryClient]);

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
    loading: isLoading || registerMutation.isPending || loginMutation.isPending || logoutMutation.isPending,
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

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};