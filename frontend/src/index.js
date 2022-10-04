import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import './App.css'
import { ContextProvider } from './context/ContextProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ContextProvider>
);
