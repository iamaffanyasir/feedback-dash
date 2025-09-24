import React from 'react';
import { motion } from 'framer-motion';
import './Stats.css';

const Stats = ({ feedbacks }) => {
  // Calculate various statistics
  const totalFeedbacks = feedbacks.length;
  const uniqueUsers = new Set(feedbacks.map(f => f.email)).size;
  
  // Color theme statistics
  const colorStats = feedbacks.reduce((acc, feedback) => {
    acc[feedback.colorTheme] = (acc[feedback.colorTheme] || 0) + 1;
    return acc;
  }, {});

  // Daily statistics for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyStats = last7Days.map(date => {
    const count = feedbacks.filter(f => 
      f.createdAt.split('T')[0] === date
    ).length;
    return { date, count };
  });

  // Average feedback length
  const avgFeedbackLength = Math.round(
    feedbacks.reduce((sum, f) => sum + f.feedback.length, 0) / totalFeedbacks
  );

  // Most active user
  const emailCounts = feedbacks.reduce((acc, f) => {
    acc[f.email] = (acc[f.email] || 0) + 1;
    return acc;
  }, {});
  
  const mostActiveUser = Object.entries(emailCounts).reduce(
    (max, current) => current[1] > max[1] ? current : max,
    ['', 0]
  );

  return (
    <div className="stats-container">
      <div className="stats-overview">
        <h2 className="stats-title">Detailed Statistics</h2>
        
        <div className="stats-grid">
          <motion.div 
            className="stat-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Total Feedbacks</h3>
              <p className="stat-number">{totalFeedbacks}</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>Unique Users</h3>
              <p className="stat-number">{uniqueUsers}</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>Avg. Feedback Length</h3>
              <p className="stat-number">{avgFeedbackLength} chars</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>Most Active User</h3>
              <p className="stat-number">{mostActiveUser[1]} feedbacks</p>
              <p className="stat-detail">{mostActiveUser[0]}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3 className="chart-title">Color Theme Distribution</h3>
          <div className="color-chart-detailed">
            {Object.entries(colorStats).map(([color, count], index) => (
              <motion.div
                key={color}
                className="color-stat-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="color-info">
                  <span className={`color-indicator ${color}`}></span>
                  <span className="color-label">{color}</span>
                </div>
                <div className="color-bar-container">
                  <div
                    className={`color-bar ${color}`}
                    style={{ width: `${(count / totalFeedbacks) * 100}%` }}
                  ></div>
                </div>
                <div className="color-stats">
                  <span className="color-count">{count}</span>
                  <span className="color-percentage">
                    ({Math.round((count / totalFeedbacks) * 100)}%)
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Last 7 Days Activity</h3>
          <div className="daily-chart">
            {dailyStats.map((day, index) => (
              <motion.div
                key={day.date}
                className="daily-bar-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="daily-bar-wrapper">
                  <div
                    className="daily-bar"
                    style={{
                      height: `${Math.max((day.count / Math.max(...dailyStats.map(d => d.count))) * 100, 10)}%`
                    }}
                  ></div>
                </div>
                <div className="daily-label">
                  <span className="daily-date">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="daily-count">{day.count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h3 className="insights-title">Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Engagement Rate</h4>
            <p>
              {uniqueUsers > 0 
                ? `${(totalFeedbacks / uniqueUsers).toFixed(1)} feedbacks per user on average`
                : 'No data available'
              }
            </p>
          </div>
          <div className="insight-card">
            <h4>Popular Theme</h4>
            <p>
              {Object.entries(colorStats).length > 0
                ? `${Object.entries(colorStats).reduce((a, b) => a[1] > b[1] ? a : b)[0]} is the most chosen theme`
                : 'No themes selected yet'
              }
            </p>
          </div>
          <div className="insight-card">
            <h4>Feedback Quality</h4>
            <p>
              {avgFeedbackLength > 50
                ? 'Users are providing detailed feedback'
                : 'Users tend to give brief feedback'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
