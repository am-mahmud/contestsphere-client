// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { RouterProvider } from "react-router/dom";
// import './index.css'
// import { router } from './routes/Routes';


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
    
//      <RouterProvider router={router} />
//   </StrictMode>,
// )

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes/Routes';
import './index.css';



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);