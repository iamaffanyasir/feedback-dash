import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './FeedbackTable.css';

const FeedbackTable = ({ feedbacks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterColor, setFilterColor] = useState('all');

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

      <div className="table-info">
        <p>Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks</p>
      </div>

      <div className="table-wrapper">
        <table className="feedback-table">
          <thead>
            <tr>
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
                className="feedback-row"
              >
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
    </div>
  );
};

export default FeedbackTable;
