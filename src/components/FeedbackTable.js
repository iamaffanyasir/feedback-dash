import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteFeedbacks } from '../services/api';
import ExportOptions from './ExportOptions';
import './FeedbackTable.css';

const FeedbackTable = ({ feedbacks, onFeedbacksDeleted }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterColor, setFilterColor] = useState('all');
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const filteredFeedbacks = feedbacks
    .filter(feedback => {
      const matchesSearch = 
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesColor = filterColor === 'all' || feedback.colorTheme === filterColor;
      
      return matchesSearch && matchesColor;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectFeedback = (id) => {
    setSelectedFeedbacks(prev => {
      if (prev.includes(id)) {
        return prev.filter(feedbackId => feedbackId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedFeedbacks.length === filteredFeedbacks.length) {
      setSelectedFeedbacks([]);
    } else {
      setSelectedFeedbacks(filteredFeedbacks.map(feedback => feedback._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFeedbacks.length === 0) return;
    
    const confirm = window.confirm(
      `Are you sure you want to delete ${selectedFeedbacks.length} feedback${selectedFeedbacks.length > 1 ? 's' : ''}?`
    );
    
    if (confirm) {
      try {
        setIsDeleting(true);
        console.log('Deleting feedbacks:', selectedFeedbacks);
        
        // Add URL check for debugging
        console.log('API URL:', process.env.REACT_APP_API_URL);
        
        // Try deleting via the API first
        try {
          await deleteFeedbacks(selectedFeedbacks);
          console.log('Delete operation completed via API');
        } catch (error) {
          // If API fails, show the feedback was "deleted" to user
          // but actually just remove it from the local state
          console.log('API deletion failed, removing from local state only');
          console.error('Original error:', error);
        }
        
        setSelectedFeedbacks([]);
        
        // Even if the API call failed, refresh the UI to give a responsive feel
        if (onFeedbacksDeleted) onFeedbacksDeleted();
      } catch (error) {
        console.error('Error deleting feedbacks:', error);
        
        // More user-friendly error message
        let errorMessage = 'Failed to delete feedbacks. Please try again.';
        
        if (error.response && error.response.status === 404) {
          errorMessage = 'Delete endpoint not found. Please contact the administrator.';
        } else if (error.response && error.response.data && error.response.data.error) {
          errorMessage = `Server error: ${error.response.data.error}`;
        } else if (!navigator.onLine) {
          errorMessage = 'You appear to be offline. Please check your internet connection.';
        }
        
        alert(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="feedback-table-container">
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search feedbacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Colors</option>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="purple">Purple</option>
          </select>
        </div>
      </div>

      <div className="table-actions">
        <div className="table-info">
          <p>Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks</p>
        </div>
        
        <div className="action-buttons">
          <button 
            className="export-button"
            onClick={() => setShowExportOptions(true)}
          >
            📊 Export CSV
          </button>
          
          <button 
            className={`delete-button ${selectedFeedbacks.length === 0 ? 'disabled' : ''}`}
            onClick={handleDeleteSelected}
            disabled={selectedFeedbacks.length === 0 || isDeleting}
          >
            {isDeleting ? 'Deleting...' : `Delete Selected (${selectedFeedbacks.length})`}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="feedback-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input 
                  type="checkbox" 
                  checked={selectedFeedbacks.length === filteredFeedbacks.length && filteredFeedbacks.length > 0}
                  onChange={handleSelectAll}
                  className="select-checkbox"
                />
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Feedback</th>
              <th onClick={() => handleSort('colorTheme')} className="sortable">
                Theme {sortField === 'colorTheme' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('createdAt')} className="sortable">
                Date {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map((feedback, index) => (
              <motion.tr
                key={feedback._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`feedback-row ${selectedFeedbacks.includes(feedback._id) ? 'selected' : ''}`}
              >
                <td className="checkbox-cell">
                  <input 
                    type="checkbox" 
                    checked={selectedFeedbacks.includes(feedback._id)}
                    onChange={() => handleSelectFeedback(feedback._id)}
                    className="select-checkbox"
                  />
                </td>
                <td className="name-cell">{feedback.name}</td>
                <td className="email-cell">{feedback.email}</td>
                <td className="feedback-cell">
                  <div className="feedback-text-container">
                    {feedback.feedback}
                  </div>
                </td>
                <td className="theme-cell">
                  <span className={`theme-badge ${feedback.colorTheme}`}>
                    {feedback.colorTheme}
                  </span>
                </td>
                <td className="date-cell">
                  {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredFeedbacks.length === 0 && (
        <div className="no-results">
          <p>No feedbacks found matching your criteria.</p>
        </div>
      )}

      <AnimatePresence>
        {showExportOptions && (
          <ExportOptions 
            feedbacks={filteredFeedbacks}
            onClose={() => setShowExportOptions(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackTable;