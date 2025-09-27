// src/components/Tabs.jsx
import React, { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mt-4">
      {/* Tab Buttons */}
      <div className="flex flex-cols-4 sm:flex-cols-4 md:flex-cols-4 space-x-3 border-b border-gray-700 sm:gap-5 lg:gap-6 focus-visible:border-amber-400 ">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={` lg:text-sm font-semibold py-4${
              activeTab === index
                ? " border-red-500 text-amber-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
