import React from 'react';
import './Tabs.css';

const Tabs = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`tab-btn${activeTab === idx ? ' active' : ''}`}
            onClick={() => onTabChange(idx)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs; 