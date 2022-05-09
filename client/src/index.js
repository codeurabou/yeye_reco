import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AppContext from './context/AppContext';

// react-query (server-state)
import { QueryClient, QueryClientProvider } from "react-query"
const query = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={query}>
      <AppContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppContext>
    </QueryClientProvider>
  </React.StrictMode>
);