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

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register with email/password
  const register = async (name, email, password, photo) => {
    // Create user in Firebase
    await createUserWithEmailAndPassword(auth, email, password);
    
    // Register in backend
    const data = await authAPI.register({ name, email, password, photo });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  // Login with email/password
  const login = async (email, password) => {
    // Login in Firebase
    await signInWithEmailAndPassword(auth, email, password);
    
    // Login in backend
    const data = await authAPI.login({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  // Google Sign In
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // You'll need to handle Google sign-in on backend later
    // For now, just return the result
    return result;
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    await signOut(auth);
  };

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in, get from backend
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const { data } = await api.get('/api/users/me');
            setUser(data);
          } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    googleSignIn,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};