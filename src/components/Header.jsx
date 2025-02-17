import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import "../styles/Header.css";

const Header = () => {
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowInput(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleContainerClick = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="header">
      <div className="search-container" onClick={handleContainerClick}>
        <button className="search-icon-left">
          <Search size={24} />
        </button>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search songs, albums, artists..."
        />
      </div>
      <div className="profile-icon">
        <img src="./profile.png" alt="Profile" className="profile-img" />
      </div>
    </div>
  );
};

export default Header;
