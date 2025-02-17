import React, { useState } from "react";
import { Home, Settings, Headphones, LogIn } from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Logo Section */}
      <div className="logo-container" onClick={() => setIsOpen(!isOpen)}>
        <img src="./logos.png" alt="Logo" className="logo" />
        <span className={`adsift-text ${isOpen ? "expanded" : "collapsed"}`}></span>
      </div>

      <div className="menu-items">
        <button className="sidebar-btn">
          <Home size={24} />
          {isOpen && <span>Home</span>}
        </button>
        <button className="sidebar-btn">
          <Settings size={24} />
          {isOpen && <span>Preferences</span>}
        </button>
        <button className="sidebar-btn">
          <Headphones size={24} />
          {isOpen && <span>Ad-Free Listening</span>}
        </button>
        <button className="sign-in-btn">
          <LogIn size={24} />
          {isOpen && <span>Sign In</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
