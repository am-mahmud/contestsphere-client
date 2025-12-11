// import { createContext, useContext, useEffect, useRef } from 'react';
// import { auth } from '../config/firebase';
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   signOut,
//   onAuthStateChanged,
// } from 'firebase/auth';
// import { authAPI } from '../api/auth';
// import api from '../utils/api';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const queryClient = useQueryClient();
//   const unsubscribeRef = useRef(null);
  
//   const {
//     data: user = null,
//     isLoading
//   } = useQuery({
//     queryKey: ['currentUser'],
//     queryFn: async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return null;

//       try {
//         const { data } = await api.get('/api/users/me');
//         return data;
//       } catch (error) {
//         console.error('Error fetching user:', error);
//         localStorage.removeItem('token');
//         return null;
//       }
//     },
//     enabled: false,
//     staleTime: Infinity,
//     gcTime: 1000 * 60 * 60 
//   });

//   const registerMutation = useMutation({
//     mutationFn: async ({ name, email, password, photo }) => {
//       await createUserWithEmailAndPassword(auth, email, password);
//       const data = await authAPI.register({ name, email, password, photo });
//       return data;
//     },
//     onSuccess: (data) => {
//       localStorage.setItem('token', data.token);
//       queryClient.setQueryData(['currentUser'], data.user);
//     },
//     onError: (error) => {
//       console.error('Registration error:', error);
//       throw error;
//     }
//   });

//   const loginMutation = useMutation({
//     mutationFn: async ({ email, password }) => {
//       await signInWithEmailAndPassword(auth, email, password);
//       const data = await authAPI.login({ email, password });
//       return data;
//     },
//     onSuccess: (data) => {
//       localStorage.setItem('token', data.token);
//       queryClient.setQueryData(['currentUser'], data.user);
//     },
//     onError: (error) => {
//       console.error('Login error:', error);
//       throw error;
//     }
//   });

//   const googleSignInMutation = useMutation({
//     mutationFn: async () => {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       return result;
//     },
//     onError: (error) => {
//       console.error('Google sign-in error:', error);
//       throw error;
//     }
//   });

//   const logoutMutation = useMutation({
//     mutationFn: async () => {
//       localStorage.removeItem('token');
//       await signOut(auth);
//     },
//     onSuccess: () => {
//       queryClient.setQueryData(['currentUser'], null);
//       queryClient.clear();
//     },
//     onError: (error) => {
//       console.error('Logout error:', error);
//       throw error;
//     }
//   });

//   useEffect(() => {
//     unsubscribeRef.current = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
     
//         queryClient.refetchQueries({ queryKey: ['currentUser'] });
//       } else {
    
//         queryClient.setQueryData(['currentUser'], null);
//       }
//     });

//     queryClient.refetchQueries({ queryKey: ['currentUser'] });

//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//       }
//     };
//   }, [queryClient]);

//   const register = async (name, email, password, photo) => {
//     return registerMutation.mutateAsync({ name, email, password, photo });
//   };

//   const login = async (email, password) => {
//     return loginMutation.mutateAsync({ email, password });
//   };

//   const googleSignIn = async () => {
//     return googleSignInMutation.mutateAsync();
//   };

//   const logout = async () => {
//     return logoutMutation.mutateAsync();
//   };

//   const setUser = (userData) => {
//     queryClient.setQueryData(['currentUser'], userData);
//   };

//   const value = {
//     user,
//     loading: isLoading || registerMutation.isPending || loginMutation.isPending || logoutMutation.isPending,
//     register,
//     login,
//     googleSignIn,
//     logout,
//     setUser,
//     isRegistering: registerMutation.isPending,
//     isLoggingIn: loginMutation.isPending,
//     isLoggingOut: logoutMutation.isPending,
//     registerError: registerMutation.error,
//     loginError: loginMutation.error,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!isLoading && children}
//     </AuthContext.Provider>
//   );
// };

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
import Swal from 'sweetalert2';

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
    try {
      // Create user in Firebase
      const firebaseUser = await createUserWithEmailAndPassword(auth, email, password);

      // Register in backend
      const data = await authAPI.register({ name, email, password, photo });
      localStorage.setItem('token', data.token);
      setUser(data.user);

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Welcome to ContestHub!',
        confirmButtonColor: '#3085d6',
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: message,
        confirmButtonColor: '#d33',
      });
      throw error;
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    try {
      // Login in Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Login in backend
      const data = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${data.user.name}!`,
        confirmButtonColor: '#3085d6',
      });

      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: message,
        confirmButtonColor: '#d33',
      });
      throw error;
    }
  };

  // Google Sign In
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      Swal.fire({
        icon: 'success',
        title: 'Google Sign In Successful',
        text: 'Welcome to ContestHub!',
        confirmButtonColor: '#3085d6',
      });

      return result;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign In Failed',
        text: error.message || 'Failed to sign in with Google',
        confirmButtonColor: '#d33',
      });
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setUser(null);

      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'See you soon!',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: error.message || 'Failed to logout',
        confirmButtonColor: '#d33',
      });
      throw error;
    }
  };

  // Check auth state on mount and page reload
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is logged in in Firebase
          const token = localStorage.getItem('token');
          
          if (token) {
            // Try to fetch user data from backend
            try {
              const { data } = await api.get('/api/users/me');
              setUser(data);
            } catch (error) {
              console.error('Error fetching user from backend:', error);
              
              // If 401, token is invalid
              if (error.response?.status === 401) {
                localStorage.removeItem('token');
                await signOut(auth);
                setUser(null);
              } else {
                // For other errors, keep user logged in based on Firebase
                // Use firebaseUser data as fallback
                setUser({
                  id: firebaseUser.uid,
                  name: firebaseUser.displayName || 'User',
                  email: firebaseUser.email,
                  photo: firebaseUser.photoURL || '',
                  role: 'user',
                });
              }
            }
          } else {
            // No token in localStorage but Firebase shows logged in
            // This shouldn't happen, but logout to be safe
            await signOut(auth);
            setUser(null);
          }
        } else {
          // User is logged out in Firebase
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
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
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};