import React, { useState } from "react";
import "./HorizontalTabs.css";

const HorizontalTabs = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };

  return (
    <div className="horizontal-tabs">
      <div className="tabs-list">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab-item ${index === activeTabIndex ? "active" : ""}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTabIndex].content}
      </div>
    </div>
  );
};

export default HorizontalTabs;
