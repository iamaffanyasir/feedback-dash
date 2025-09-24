import React from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';

const Dashboard = ({ feedbacks }) => {
  const totalFeedbacks = feedbacks.length;
  const uniqueUsers = new Set(feedbacks.map(f => f.email)).size;
  
  const colorStats = feedbacks.reduce((acc, feedback) => {
    acc[feedback.colorTheme] = (acc[feedback.colorTheme] || 0) + 1;
    return acc;
  }, {});

  const recentFeedbacks = feedbacks.slice(0, 5);

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div
      className={`stat-card ${color}`}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard
          title="Total Feedbacks"
          value={totalFeedbacks}
          icon="📝"
          color="blue"
        />
        <StatCard
          title="Unique Users"
          value={uniqueUsers}
          icon="👥"
          color="green"
        />
        <StatCard
          title="Blue Theme"
          value={colorStats.blue || 0}
          icon="🔵"
          color="blue"
        />
        <StatCard
          title="Red Theme"
          value={colorStats.red || 0}
          icon="🔴"
          color="red"
        />
      </div>

      <div className="dashboard-content">
        <div className="recent-feedbacks">
          <h2 className="section-title">Recent Feedbacks</h2>
          <div className="feedback-list">
            {recentFeedbacks.map((feedback, index) => (
              <motion.div
                key={feedback._id}
                className={`feedback-item ${feedback.colorTheme}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="feedback-header">
                  <span className="feedback-name">{feedback.name}</span>
                  <span className="feedback-date">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="feedback-text">{feedback.feedback}</p>
                <span className="feedback-email">{feedback.email}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="color-distribution">
          <h2 className="section-title">Color Theme Distribution</h2>
          <div className="color-chart">
            {Object.entries(colorStats).map(([color, count]) => (
              <div key={color} className="color-bar">
                <div className="color-label">
                  <span className={`color-dot ${color}`}></span>
                  <span className="color-name">{color}</span>
                </div>
                <div className="color-progress">
                  <div
                    className={`color-fill ${color}`}
                    style={{
                      width: `${(count / totalFeedbacks) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="color-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
