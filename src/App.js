import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import FeedbackTable from './components/FeedbackTable';
import Stats from './components/Stats';
import Diagnostics from './components/Diagnostics';
import { getAllFeedbacks } from './services/api';
import './App.css';

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  // For debugging in production
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    // Keyboard shortcut to show diagnostics
    const handleKeyDown = (e) => {
      // Ctrl+Shift+D to toggle diagnostics
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDiagnostics(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await getAllFeedbacks();
      setFeedbacks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch feedbacks');
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbacksDeleted = () => {
    fetchFeedbacks(); // Refresh the data after deletion
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading feedbacks...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchFeedbacks} className="retry-button">
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard feedbacks={feedbacks} />;
      case 'table':
        return <FeedbackTable 
          feedbacks={feedbacks}
          onFeedbacksDeleted={handleFeedbacksDeleted}
        />;
      case 'stats':
        return <Stats feedbacks={feedbacks} />;
      default:
        return <Dashboard feedbacks={feedbacks} />;
    }
  };

  return (
    <div className="app">
      {showDiagnostics && <Diagnostics />}
      <header className="app-header">
        <h1 className="app-title">Feedback Dashboard</h1>
        <div className="refresh-button-container">
          <button onClick={fetchFeedbacks} className="refresh-button">
            🔄 Refresh
          </button>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Overview
        </button>
        <button
          className={`nav-button ${activeTab === 'table' ? 'active' : ''}`}
          onClick={() => setActiveTab('table')}
        >
          📋 All Feedbacks
        </button>
        <button
          className={`nav-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📈 Statistics
        </button>
      </nav>

      <main className="app-main">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}

export default App;
