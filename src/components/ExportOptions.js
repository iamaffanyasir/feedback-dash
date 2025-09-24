import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ExportOptions.css';

const ExportOptions = ({ feedbacks, onClose }) => {
  const [exportOptions, setExportOptions] = useState({
    includeHeaders: true,
    dateFormat: 'local', // 'local', 'iso', or 'short'
    fields: {
      name: true,
      email: true,
      feedback: true,
      colorTheme: true,
      createdAt: true
    }
  });
  
  const handleOptionChange = (e) => {
    const { name, checked, value } = e.target;
    
    if (name.startsWith('field-')) {
      const field = name.replace('field-', '');
      setExportOptions(prev => ({
        ...prev,
        fields: {
          ...prev.fields,
          [field]: checked
        }
      }));
    } else if (name === 'includeHeaders') {
      setExportOptions(prev => ({
        ...prev,
        includeHeaders: checked
      }));
    } else if (name === 'dateFormat') {
      setExportOptions(prev => ({
        ...prev,
        dateFormat: value
      }));
    }
  };
  
  const exportCSV = () => {
    // Create headers based on selected fields
    const headers = [];
    const { fields } = exportOptions;
    
    if (fields.name) headers.push('Name');
    if (fields.email) headers.push('Email');
    if (fields.feedback) headers.push('Feedback');
    if (fields.colorTheme) headers.push('Theme');
    if (fields.createdAt) headers.push('Date');
    
    // Transform feedback data into CSV rows based on selected fields
    const csvRows = feedbacks.map(feedback => {
      const row = [];
      
      if (fields.name) row.push(`"${feedback.name.replace(/"/g, '""')}"`);
      if (fields.email) row.push(`"${feedback.email.replace(/"/g, '""')}"`);
      if (fields.feedback) row.push(`"${feedback.feedback.replace(/"/g, '""')}"`);
      if (fields.colorTheme) row.push(`"${feedback.colorTheme}"`);
      
      if (fields.createdAt) {
        const date = new Date(feedback.createdAt);
        let formattedDate = '';
        
        switch (exportOptions.dateFormat) {
          case 'iso':
            formattedDate = date.toISOString();
            break;
          case 'short':
            formattedDate = date.toLocaleDateString();
            break;
          case 'local':
          default:
            formattedDate = date.toLocaleString();
            break;
        }
        
        row.push(`"${formattedDate}"`);
      }
      
      return row;
    });
    
    // Combine headers and rows
    let csvContent = '';
    
    if (exportOptions.includeHeaders) {
      csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');
    } else {
      csvContent = csvRows.map(row => row.join(',')).join('\n');
    }
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onClose();
  };

  return (
    <motion.div
      className="export-options-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="export-options-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h3>Export Options</h3>
        
        <div className="export-section">
          <h4>Fields to Include</h4>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="field-name"
                checked={exportOptions.fields.name}
                onChange={handleOptionChange}
              />
              Name
            </label>
            
            <label>
              <input
                type="checkbox"
                name="field-email"
                checked={exportOptions.fields.email}
                onChange={handleOptionChange}
              />
              Email
            </label>
            
            <label>
              <input
                type="checkbox"
                name="field-feedback"
                checked={exportOptions.fields.feedback}
                onChange={handleOptionChange}
              />
              Feedback
            </label>
            
            <label>
              <input
                type="checkbox"
                name="field-colorTheme"
                checked={exportOptions.fields.colorTheme}
                onChange={handleOptionChange}
              />
              Theme
            </label>
            
            <label>
              <input
                type="checkbox"
                name="field-createdAt"
                checked={exportOptions.fields.createdAt}
                onChange={handleOptionChange}
              />
              Date
            </label>
          </div>
        </div>
        
        <div className="export-section">
          <h4>Format Options</h4>
          <label>
            <input
              type="checkbox"
              name="includeHeaders"
              checked={exportOptions.includeHeaders}
              onChange={handleOptionChange}
            />
            Include column headers
          </label>
          
          <div className="date-format-selector">
            <span>Date Format:</span>
            <select 
              name="dateFormat" 
              value={exportOptions.dateFormat}
              onChange={handleOptionChange}
              disabled={!exportOptions.fields.createdAt}
            >
              <option value="local">Local (e.g. 1/1/2023, 12:00:00 PM)</option>
              <option value="iso">ISO (e.g. 2023-01-01T12:00:00.000Z)</option>
              <option value="short">Short Date (e.g. 1/1/2023)</option>
            </select>
          </div>
        </div>
        
        <div className="export-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-export-button" onClick={exportCSV}>
            Export {feedbacks.length} Records
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExportOptions;
