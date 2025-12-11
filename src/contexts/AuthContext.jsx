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


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
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

    return () => unsubscribe();
  }, []);


  const register = async (name, email, password, photo) => {
    await createUserWithEmailAndPassword(auth, email, password);
    const data = await authAPI.register({ name, email, password, photo });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    const data = await authAPI.login({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

 
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
  };

  const logout = async () => {
    localStorage.removeItem('token');
    await signOut(auth);
    setUser(null);
  };

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