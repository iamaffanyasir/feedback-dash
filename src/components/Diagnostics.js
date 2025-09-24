import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Diagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    apiUrl: process.env.REACT_APP_API_URL || 'Not set',
    browserInfo: navigator.userAgent,
    windowSize: `${window.innerWidth}x${window.innerHeight}`,
    networkStatus: navigator.onLine ? 'Online' : 'Offline',
    apiStatus: 'Checking...',
    renderTime: new Date().toISOString()
  });

  useEffect(() => {
    // Test API connection
    if (diagnostics.apiUrl !== 'Not set') {
      axios.get(`${diagnostics.apiUrl}/ping`)
        .then(response => {
          setDiagnostics(prev => ({
            ...prev,
            apiStatus: 'Connected'
          }));
        })
        .catch(error => {
          setDiagnostics(prev => ({
            ...prev,
            apiStatus: `Error: ${error.message}`
          }));
        });
    }
  }, [diagnostics.apiUrl]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: '#00ff00',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999
    }}>
      <h3>Diagnostics:</h3>
      <pre>{JSON.stringify(diagnostics, null, 2)}</pre>
    </div>
  );
};

export default Diagnostics;
