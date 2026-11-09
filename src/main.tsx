import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import { App } from './App';
import { initOta } from './utils/otaUpdater';
import './index.css';

// Not awaited on purpose: must not block first paint. notifyAppReady is sent from App after mount.
void initOta();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
