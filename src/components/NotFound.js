import React from 'react';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1>Page Not Found</h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          padding: '10px 20px',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
