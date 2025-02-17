import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Categories from './components/Categories';
import AudioPlayer from './components/AudioPlayer';

import './App.css';

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Categories />
      </div>
      <div className="audio-player-container">
        <AudioPlayer />
      </div>
    </div>
  );
};

export default App;
