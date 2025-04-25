import { useRef, useEffect } from "react";
import { Search } from "lucide-react";
import "../styles/Header.css";

const Header = () => {
  const inputRef = useRef(null);

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      // Optionally, you can clear the input value or blur the field if needed.
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleContainerClick = () => {
    setTimeout(() => inputRef.current?.focus(), 0);
  };
const handleClick_AD = () => {
  window.location.href = "https://kavin-antony.github.io/ADSIFT-WEB_APP_REACT_WITH_AD/";
}
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
        <img src="./profile.png" alt="Profile" className="profile-img" onClick={handleClick_AD}/>
      </div>
    </div>
  );
};

export default Header;
